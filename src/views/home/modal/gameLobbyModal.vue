<template>
  <div class="gameLobby" ref="gameLobbyss">
    <div class="optionBar">
      <ul class="gameTypeWrap typeWrap">
        <!-- home -->
        <li class="gameTypeItem" @click="router.push('/home')">
          <img
            :src="
              require(`@/assets/images/game/gameType/home_${
                route.name == 'index' ? 2 : 1
              }.png`)
            "
            alt=""
          />
        </li>
        <!-- 個遊戲 -->
        <li
          v-for="(gameType, i) in allGamesType"
          :key="i"
          @click="changeType(gameType, 'category')"
          class="gameTypeItem"
        >
          <img
            :src="
              require(`@/assets/images/game/gameType/${gameType}_${
                categoryType === gameType ? '2' : '1'
              }.png`)
            "
            alt=""
          />
        </li>
      </ul>
      <ul class="firmWrap typeWrap">
        <li class="firmItem" @click="changeType('', 'studio')">
          <!-- :class="['firmItem', { selected: target.studio === '' }]" -->
          <img
            :src="
              require(`@/assets/images/game/studio/all_${
                studioType === '' ? 2 : 1
              }.png`)
            "
            alt="firm icon"
            class="studioIcon"
          />
        </li>
        <li
          v-for="(studio, i) in studioAry"
          :key="i"
          class="firmItem"
          @click="changeType(studio, 'studio')"
        >
          <img
            :src="
              require(`@/assets/images/game/studio/${studio}_${
                studioType === studio ? 2 : 1
              }.png`)
            "
            alt="firm icon"
            class="studioIcon"
          />
        </li>
      </ul>
    </div>
    <div class="noticeChooseType">
      <img
        :src="require(`@/assets/images/game/icon/icon_${categoryType}.png`)"
      />
      <span>{{ $t(categoryType) }}</span>
    </div>
    <ul class="gameWrap">
      <li
        class="gameItem"
        @click="
          enterGame({
            gameId: gameEntry.studio_game_id,
            studio: gameEntry.studio,
            forbind: {
              maintence: gameEntry.maintence,
              test: userInfo.is_test && !gameEntry.tester_can_play,
            },
            comingsoon: gameEntry.is_comming_soon,
          })
        "
        v-for="gameEntry in gameList"
        :key="gameEntry.studio_game_id"
        v-show="gameEntry.show && !gameEntry.maintence"
      >
        <img
          src="@/assets/images/game/hot.png"
          alt="hot"
          class="hotIcon"
          v-show="gameEntry.hot"
        />
        <img
          src="@/assets/images/game/new.png"
          alt="hot"
          class="newIcon"
          v-show="gameEntry.new && studioType != 'evo' && studioType != 'funky'"
        />
        <img
          :src="gameEntry.icon_path"
          :alt="gameEntry?.game_name?.en"
          :class="['gameIcon', { disableIcon: gameEntry.maintence === true }]"
        />
        <div class="tipWrap" v-show="gameEntry.maintence === true">
          <p class="tipText">{{ $t("gameLobby.maintence") }}</p>
        </div>
        <div
          class="tipWrap"
          v-show="
            userInfo.is_test &&
            !gameEntry.maintence &&
            !gameEntry.tester_can_play
          "
        >
          <p class="tipText">{{ $t("gameLobby.testNotOpen") }}</p>
        </div>
      </li>
      <loading class="loading" v-if="isLoading" />
    </ul>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  reactive,
  watch,
} from "vue";
import { getGameListApi, getGameUrlApi } from "@/api/game";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import throttle from "@/utils/throttle";
import loading from "@/components/loading";
import { useI18n } from "vue-i18n";
import { usectrlLogin } from "@/store/ctrlLogin";

const { depositPageStatus } = storeToRefs(usectrlLogin());
const { t } = useI18n();

const { useGame, useAuth, useMessage, useSounds } = useStore();

const authStore = useAuth();
const { token, userInfo } = storeToRefs(authStore);

const soundStore = useSounds();
const { bgmSound, SeButtonValue } = storeToRefs(soundStore);

const gameStore = useGame();
const { allGamesType } = storeToRefs(gameStore);

const { openMsg } = useMessage();

const route = useRoute();
const router = useRouter();

const gameList = ref([]);

const categoryType = computed(() => route.params.category);
const studioType = computed(() => route.params.studio);
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

// const target = ref({
//   category: categoryType.value,
//   studio: studioType.value,
// });

const totalStudios = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
  "mgplus",
  "PP",
]);
const studioAry = ref([
  "funky",
  "evo",
  "joygames",
  "goldenwind",
  "pg",
  "facai",
  "jili",
  "mgplus",
  "PP",
]);

const gameListParams = ref({
  category: categoryTans(categoryType.value),
  limit: 50,
  offset: 0,
  studio: studioType.value,
});

let listTotal = 1;
const isLoading = ref(true);
const gameListRes = ref(null);
// 0911
const getGameListHanlder = async (gameListParams, filter, re = false) => {
  // 若re=true，先搜尋"全部"，再分類
  if (!re) {
    if (gameList.value.length >= listTotal && listTotal > 0) {
      return;
    }
    isLoading.value = true;
    let { category, limit, offset, studio } = gameListParams;
    gameListRes.value = await getGameListApi({
      category,
      limit,
      offset,
      studio,
    });
    listTotal = gameListRes.value.data.data.total;
    gameList.value.push(...gameListRes.value.data.data.games);
    isLoading.value = false;
    if (filter) {
      changeStudioList();
    }
  } else {
    isLoading.value = true;
    // 先撈全部
    let { category, limit, offset } = gameListParams;
    gameListRes.value = await getGameListApi({
      category,
      limit,
      offset,
      studio: "",
    });
    listTotal = gameListRes.value.data.data.total;
    gameList.value.push(...gameListRes.value.data.data.games);
    // 先得到分類(完整分類)
    changeStudioList();
    // 然後清空 一些數據
    gameList.value = [];
    listTotal = 0;
    // 重新讀
    await getGameListHanlder(gameListParams, false);
  }

  // if (re && filter) {
  //   let tmpgameListParams = gameListParams;
  //   tmpgameListParams.studio = studioType.value;
  //   await getGameListHanlder(tmpgameListParams, false);
  // }
};

const changeStudioList = async () => {
  const studios = gameListRes.value.data.data.games.map((game) => game.studio);
  studioAry.value = totalStudios.value.filter((item) => studios.includes(item));
};

const filter = ref(true);

const changeType = (type, key = "") => {
  // 跳轉路由=>監控路由變動=>搜索API
  if (key === "category") {
    gameStore.$patch({
      category: type,
      studio: "",
    });
    router.push(`/gameLobby/${type}`);
  } else if (key === "studio") {
    gameStore.$patch({
      category: categoryType.value,
      studio: type,
    });
    router.push(`/gameLobby/${categoryType.value}/${type}`);
  }
};

const gameLobbyss = ref(null);

const lazyloadingHandler = reactive({
  html: document.querySelector("html"),
  handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = this.html;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      gameListParams.value.offset += gameListParams.value.limit;
      getGameListHanlder(gameListParams.value);
    }
  },
  openListener() {
    window.addEventListener("scroll", throttleScroll);
  },
  removeListener() {
    window.removeEventListener("scroll", throttleScroll);
    this.html = null;
  },
});

const throttleScroll = throttle(
  lazyloadingHandler.handleScroll.bind(lazyloadingHandler),
  300
);

onMounted(() => {
  // 一進入遊戲大廳
  lazyloadingHandler.openListener();
  // gameListParams["studio"] = ""; //預設搜尋全部
  // target.value.studio = ""; //預設搜尋全部
  gameListParams.value = {
    category: categoryTans(categoryType.value),
    limit: 50,
    offset: 0,
    studio: studioType.value,
  };
  if (studioType.value == "") {
    filter.value = true;
  } else {
    filter.value = false;
  }
  getGameListHanlder(gameListParams.value, filter.value, true);
});
watch(route, (v) => {
  // 在遊戲大廳內
  // route是在遊戲大廳，且參數變的時候，變更搜索項目
  // gameListParams[key] = key === "category" || "" ? categoryTans(type) : type;
  // gameListParams.offset = 0;
  if (v.name === "gameLobby") {
    gameList.value = [];
    lazyloadingHandler.openListener();

    gameListParams.value = {
      category: categoryTans(categoryType.value),
      limit: 50,
      offset: 0,
      studio: studioType.value,
    };

    if (studioType.value == "") {
      filter.value = true;
    } else {
      filter.value = false;
    }
    getGameListHanlder(gameListParams.value, filter.value, true);
  }
});
onBeforeUnmount(() => {
  lazyloadingHandler.removeListener();
  onBeforeUnmount(() => {
    gameStore.$patch({
      category: null,
    });
  });
});

// 進入遊戲
const enterGame = async ({ gameId, studio = "", forbind, comingsoon }) => {
  // studio 傳給後端的值，targetStudio為route參數，因targetStudio可能為空值(all)所以需要拆分兩個
  if (comingsoon) {
    return;
  }
  if (!token.value) {
    openMsg({ content: t("registerFirst") }).then(() => {
      // router.push("/auth/login");
      usectrlLogin().$patch({
        loginpageStatus: true,
      });
    });
    return;
  }

  if (userInfo.value.wallets[0].balance / 10000 <= 0.1) {
    console.log("餘額不足");
    gameStore.$patch({
      studio: studio,
      gameId: gameId,
    });
    openMsg({
      content: "Saldo insuficiente na carteira.",
      hasCancel: true,
      deposit: true,
      entryGame: true,
      joinGame: true,
    })
      .then(() => {
        depositPageStatus.value = true;
      })
      .catch(() => {
        console.log("繼續遊戲");
      });
  } else {
    if (forbind.maintence) {
      openMsg({ content: t("gameLobby.maintence") });
      return;
    } else if (forbind.test) {
      openMsg({ content: t("gameLobby.testNotOpen") });
      return;
    }

    const data = {
      sound: SeButtonValue.value === "on" ? true : false,
      bgm: bgmSound.value,
      lang: "en-US",
    };
    const res = await getGameUrlApi(studio, gameId, data);

    gameStore.$patch({
      gameUrl: res.data.data.url,
    });

    router.push({
      path: `/gameRoom/${categoryType.value}/${studioType.value}`,
      query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
    });
  }
};
</script>

<style lang="scss" scoped>
.gameLobby {
  position: relative;
  width: 100%;
  min-height: calc(100vh - $topBar-height);
  padding-top: 10px;
  overflow-y: auto;
  .optionBar {
    height: 150px;
    top: 0rem;
    left: 0;
    .gameTypeWrap {
      width: 100%;
      height: 90px;
      font-size: 0;
      overflow-x: auto;
      white-space: nowrap;
      text-align: center;
      .gameTypeItem {
        font-size: 0;
        display: inline-block;
        text-align: center;
        height: 100%;
        margin-right: 5px;
        img {
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .firmWrap {
      width: calc(100% - 4px);
      height: calc(60px - 2px - 4px);
      // border: 2px solid gray;
      padding: 1px 0 1px 0px;
      margin-top: 0.5rem;
      border-radius: 60px;
      overflow-x: auto;
      white-space: nowrap;
      .firmItem {
        display: inline-block;
        position: relative;
        // margin-right: 1px;
        background-size: 100% 100%;
        background-position: center;
        padding: 2px 1px;
        height: calc(100% - 2px);
        .studioIcon {
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  .noticeChooseType {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem;
    img {
      margin-right: 0.5rem;
    }
    span {
      font-size: 1.3rem;
    }
  }
  .gameWrap {
    width: calc(100%);
    margin-top: 10px;
    font-size: 0;
    overflow-x: hidden;
    .gameItem {
      // width: calc(20% - 10px);
      display: inline-block;
      // height: 200px;
      margin-bottom: 10px;
      margin-right: 5px;
      margin-left: 5px;
      position: relative;
      width: 140px;
      // @include breakpoint-up("xs") {
      //   width: calc(50% - 10px);
      //   // width: calc(8% - 10px);
      // }
      // // @include breakpoint-up("sm") {
      // //   width: calc(50% - 10px);
      // // }
      // @include breakpoint-up("md") {
      //   // width:  calc(33% - 10px);
      //   width: calc(33% - 10px);
      // }
      // // @include breakpoint-up("lg") {
      // //   width: calc(33% - 10px);
      // // }
      // @include breakpoint-up("xl") {
      //   width: calc(20% - 10px);
      // }
      // @include breakpoint-up("xxl") {
      //   width: calc(20% - 10px);
      // }
      .tipWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: $popout-page-bg;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        .tipText {
          text-align: center;
          color: #fff;
        }
      }
      .gameIcon {
        width: 100%;
        // height: 100%;
        object-fit: contain;
      }
      .disableIcon {
        filter: grayscale(1);
      }
      .newIcon {
        width: 40%;
        position: absolute;
        top: 0;
        left: -5%;
      }
      .hotIcon {
        width: 40%;
        position: absolute;
        top: 0;
        right: -5%;
      }
    }
  }
  .loading {
    z-index: $downBar-index;
    background: transparent;
    position: fixed;
    left: 50%;
    width: 40%;
    top: 50%;
    transform: translateX(-50%);
  }
}
</style>
