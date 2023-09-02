<template>
  <div class="block" v-show="listStatus" @click="closeModal"></div>
  <!-- v-model:receiveNumModal="receiveNumModal" -->
  <div class="detailList" v-show="listStatus">
    <div v-for="(v, k) in topList" :key="k" class="listBtn" @click="go(v)">
      <img
        :src="require(`@/assets/images/mainMenu/${v.pic}_1.png`)"
        class="icon"
      />
      <Dot
        class="alert"
        v-show="v.pic == 'notice' && hasAct('normal') && token"
      ></Dot>
      <span>{{ $t(v.word) }}</span>
    </div>
    <hr />
    <div>
      <div v-for="(gameType, i) in allGamesType" :key="i" class="gameTypeItem">
        <div class="gameType" @click="changeType(gameType, 'category')">
          <img
            :src="
              require(`@/assets/images/mainMenu/${gameType}_${
                target.category === gameType ? '2' : '1'
              }.png`)
            "
            class="icon"
          />
          <div class="gameTypeRight">
            <span
              :class="[
                'gameTypeName',
                target.category === gameType ? 'choosedFont' : '',
              ]"
            >
              {{ $t(gameType) }}
            </span>
            <img
              :src="
                require(`@/assets/images/mainMenu/background/arrow_${
                  target.category === gameType ? '3' : '1'
                }.png`)
              "
            />
          </div>
        </div>
        <transition name="manufacturersSlide">
          <div v-show="target.category === gameType" class="manufacturers">
            <!-- {{ route.params.category }}
            {{ route.params.studio }} -->
            <!-- @/assets/images/mainMenu/manufacturers -->
            <img
              v-for="(studio, i) in studioAry"
              :src="
                require(`@/assets/images/mainMenu/manufacturers/${studio}_${checkSearch(
                  target.category,
                  studio
                )}.png`)
              "
              :alt="studio"
              class="studioIcon"
              :key="i"
              @click="gotoGameLobby(studio, gameType)"
            />

            <!-- :class="['firmItem', { selected: target.studio === studio }]" -->
          </div>
        </transition>
      </div>
    </div>
    <hr />
    <div v-for="(v, k) in bottomList" :key="k" class="listBtn" @click="go(v)">
      <img
        :src="require(`@/assets/images/mainMenu/${v.pic}_1.png`)"
        class="icon"
      />
      <span>{{ $t(v.word) }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import Dot from "@/components/alertDot.vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
const { useGame, useAnnouncement, useAuth } = useStore();
import { getGameListApi } from "@/api/game";
//
// 客服
import { serviceConect } from "@/store/serviceConnet";
const { setserviceConectData } = serviceConect();
// 檢查是否有公告
const announcementStore = useAnnouncement();
const { hasAct } = announcementStore;
// 檢查是否有登入
const { token } = storeToRefs(useAuth());
//
const route = useRoute();
const router = useRouter();

const gameStore = useGame();
const { allGamesType } = storeToRefs(gameStore);
// const props =
defineProps({
  listStatus: {
    type: Boolean,
    default: false,
  },
});
const categoryType = computed(() => route.params.category);
const studioType = computed(() => route.params.studio);
const target = ref({
  category: categoryType.value,
  studio: studioType.value,
});
const topList = [
  {
    pic: "notice",
    word: "公告",
  },
  {
    pic: "promotions",
    word: "優惠活動",
  },
];
const bottomList = [
  {
    pic: "service",
    word: "客服",
  },
  {
    pic: "settings",
    word: "設定",
  },
];
const gameListArrowStatus = ref(null);
// 0801
// const gameTypeList = [];
const studioAry = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
]);
const categoryTans = (type) => {
  let category = "";
  switch (type) {
    case "fishing":
      category = 1;
      break;
    case "slot":
      category = 2;
      break;
    case "blockchain":
      category = 4;
      break;
    case "bingo":
      category = 16;
      break;
    case "poker":
      category = 8;
      break;
    case "casino":
      category = 32;
      break;
    case "crash":
      category = 128;
      break;
    case "live":
      category = 256;
      break;
    default:
      category = 1;
      break;
  }

  return category;
};
const gameListParams = {
  category: categoryTans(target.value.category),
  limit: 50,
  offset: 0,
  studio: target.value.studio,
};
const filter = ref(true);
const changeType = (type, key = "") => {
  if (gameListArrowStatus.value == type) {
    target.value[key] = "";
    gameListArrowStatus.value = "";
    return;
  } else {
    gameListArrowStatus.value = type;
  }
  if (allGamesType.value.includes(type)) {
    target.value["studio"] = "";
    gameListParams["studio"] = "";
  }

  target.value[key] = type;
  gameListParams[key] = key === "category" || "" ? categoryTans(type) : type;
  gameListParams.offset = 0;
  if (key === "category") {
    filter.value = true;
    gameStore.$patch({
      category: type,
    });
  }
  getGameListHanlder(gameListParams, filter.value);
};

const isLoading = ref(true);
const gameListRes = ref(null);
const getGameListHanlder = async (gameListParams, filter) => {
  isLoading.value = true;
  let { category, limit, offset, studio } = gameListParams;
  gameListRes.value = await getGameListApi({ category, limit, offset, studio });
  console.log(gameListRes);
  isLoading.value = false;
  if (filter) {
    changeStudioList();
  }
};
const totalStudios = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
]);
const changeStudioList = () => {
  const studios = gameListRes.value.data.data.games.map((game) => game.studio);
  studioAry.value = totalStudios.value.filter((item) => studios.includes(item));
  console.log(studioAry.value);
};
//
const gotoGameLobby = (studio, gameType) => {
  gameStore.$patch({
    category: gameType,
    studio: studio,
  });
  router.push(`/gameLobby/${gameType}/${studio}/?re=true`);
};
// 判斷目前是否要顯示搜尋的遊戲頁面
const checkSearch = (gametype, studio) => {
  if (route.params.category == gametype && route.params.studio == studio) {
    return 1;
  } else {
    return 2;
  }
};
//
const emit = defineEmits(["update:listStatus"]);
const closeModal = () => {
  emit("update:listStatus", false);
};
//
const go = (v) => {
  console.log(v);
  switch (v.word) {
    case "公告":
      router.push(`/info/announcement`);
      break;
    case "優惠活動":
      router.push(`/activity/activityList`);
      break;
    case "客服":
      setserviceConectData(true);
      break;
    case "設定":
      router.push(`/setting/sound`);
      break;
  }
  closeModal();
};
</script>

<style lang="scss" scoped>
.block {
  position: fixed;
  top: $topBar-height;
  width: 100%;
  top: 0;
  left: 0%;
  height: calc(100vh);
  padding: 0 1rem;
  background: blue;
  opacity: 0.5;
  z-index: 21;
}
.detailList {
  width: 300px;
  position: fixed;
  // top: 0;
  top: $topBar-height;
  left: 0rem;
  // height: calc(100vh - 3.5rem);
  padding: 0 1rem;
  min-height: 100%;
  background: green;
  background-image: url("@/assets/images/mainMenu/background/flat.png");
  background-size: 100% 100%;
  color: white;
  z-index: 22;
}
.listBtn {
  // width: 100%;
  font-size: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .icon {
    height: 2rem;
    object-fit: contain;
    margin-right: 1rem;
  }
  span {
    vertical-align: middle;
  }
  .alert {
    left: 2.3rem;
    top: 0.4rem;
    position: absolute;
  }
}
.gameTypeItem {
  margin-bottom: 0.5rem;
  .gameType {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .icon {
      margin-right: 1rem;
    }
    .gameTypeRight {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      .gameTypeName {
        margin-right: 1rem;
      }
      .choosedFont {
        color: pink;
      }
    }
  }
  .manufacturers {
    width: 100%;
    margin-top: 0.8rem;
    .studioIcon {
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
  }
  // 兩個一對，進場效果
  //
  .manufacturersSlide-enter-active {
    transform: translateY(-50%);
  }
  .manufacturersSlide-enter-to {
    //定義元素在進場「結束時」的樣式
    transition: transform 0.5s ease;
    transform: translateY(0%);
  }
  // 兩個一對
  //
  .manufacturersSlide-leave-to {
    //定義元素在退場「結束時」的樣式。
    transform: translateY(-50%); // 頁面離開時的平滑右滑效果
    transition: transform 0s ease;
  }
  .manufacturersSlide-leave-from {
    //定義元素在退場「結束時」的樣式。
    // transform: translateY(v-bind(posX_LeaveBegin)); // 頁面離開時的平滑右滑效果
    transform: translateY(0%);
    // transition: transform 1s ease;
  }
}
</style>
