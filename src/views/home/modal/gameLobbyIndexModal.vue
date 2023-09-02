<template>
  <div class="gameLobby">
    <div class="optionBar">
      <ul class="gameTypeWrap">
        <!-- home -->
        <li class="gameTypeItem" @click="router.push('/home')">
          <img
            :src="
              require(`@/assets/images/game/gameType/home_${
                route.name == 'index' ? 1 : 2
              }.png`)
            "
            alt=""
          />
        </li>
        <!-- 各個遊戲 -->
        <li
          v-for="(gameType, i) in allGamesType"
          :key="i"
          class="gameTypeItem"
          @click="entryHandler(gameType)"
        >
          <img
            :src="require(`@/assets/images/game/gameType/${gameType}_1.png`)"
            alt=""
          />
        </li>
      </ul>
    </div>
    <!-- 熱門遊戲 -->
    <div class="hot">
      <div class="noticeChooseType">
        <div class="title">
          <img :src="require(`@/assets/images/game/icon/icon_hot.png`)" />
          <span>{{ $t("熱門") }}</span>
        </div>
      </div>
      <ul class="gameWrap">
        <li v-for="(v, k) in hotgamedata" :key="k" class="gameItem">
          <img
            class="gameIcon"
            :src="v.icon_path"
            @click="
              enterGame({
                gameId: v.studio_game_id,
                studio: v.studio,
                forbind: {
                  maintence: v.maintence,
                  test: userInfo.is_test && !v.tester_can_play,
                },
                comingsoon: false,
                datas: v,
              })
            "
          />
        </li>
      </ul>
    </div>
    <!-- 詳細遊戲 -->
    <div v-for="(v, k) in gameList" :key="k">
      <!-- 標題 -->
      <div class="noticeChooseType">
        <div class="title">
          <img :src="require(`@/assets/images/game/icon/icon_${k}.png`)" />
          <span>{{ $t(k) }}</span>
        </div>
        <div class="moregames" @click="entryHandler(k)">
          <span>{{ $t("更多遊戲") }} </span>
          <img
            :src="require(`@/assets/images/mainMenu/background/arrow_1.png`)"
          />
        </div>
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
              datas: gameEntry,
              category: k,
            })
          "
          v-for="(gameEntry, gameEntryKey) in v"
          :key="gameEntryKey"
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
            v-show="gameEntry.new"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getGameUrlApi, getGameListApi } from "@/api/game";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import loading from "@/components/loading";
import { useI18n } from "vue-i18n";
import { usectrlLogin } from "@/store/ctrlLogin";
import { usehotgameStore } from "@/store/hotgame";
const { hotgamedata } = storeToRefs(usehotgameStore());
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

const gameList = ref({});

const entryHandler = (entry) => {
  gameStore.$patch({
    category: entry,
    studio: "",
  });
  router.push(`/gameLobby/${entry}`);
};

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

// https://api.evostake00.com/core/games?category=128&limit=50&offset=0&studio=
const getGameListHanlder = async (category) => {
  const { data } = await getGameListApi({
    category: category,
    limit: 20,
    offset: 0,
    studio: "",
  });
  return data.data.games;
};

const getAllgameList = async () => {
  isLoading.value = true;
  gameList.value = {};
  for (let k of allGamesType.value) {
    const tn = categoryTans(k);
    gameList.value[k] = [];
    gameList.value[k] = await getGameListHanlder(tn);
  }
  isLoading.value = false;
  console.log(gameList.value);
};

// const totalStudios = ref([
//   "funky",
//   "evo",
//   "joygames",
//   "goldenwind",
//   "pg",
//   "facai",
//   "jili",
// ]);
// const studioAry = ref([
//   "funky",
//   "evo",
//   "joygames",
//   "goldenwind",
//   "pg",
//   "facai",
//   "jili",
// ]);

const isLoading = ref(false);

onMounted(() => {
  getAllgameList();
  usehotgameStore().gethotGame();
});

// 進入遊戲
const enterGame = async ({
  gameId,
  studio = "",
  forbind,
  comingsoon,
  datas,
  categoryData,
}) => {
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
        router.push("/deposit/deposit");
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
    // 可能要改
    // const { category, studio: targetStudio } = 12;
    const category = categoryTans(categoryData);
    const studio = datas.studio;
    const res = await getGameUrlApi(studio, gameId, data);
    gameStore.$patch({
      gameUrl: res.data.data.url,
    });

    router.push({
      path: `/gameRoom/${category}/${studio}`,
      query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
    });
  }
};
</script>

<style lang="scss" scoped>
.gameLobby {
  position: relative;
  width: calc(100% - 10px);
  // height: calc(100vh - 7rem);
  padding: 10px 5px 0 5px;
  overflow-y: auto;
  // background: red;
  margin: auto;
  .optionBar {
    // position: sticky;
    // height: 150px;
    top: 0rem;
    left: 0;
    // z-index: 10;
    // background: #fff;
    background: #23003e;
    // &.notLogin {
    //   top: $notLogin-topBar-height;
    // }

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
  }
  .noticeChooseType {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem;
    .title {
      display: flex;
      align-items: center;
      width: 8rem;
      font-size: 1.3rem;
    }
    .moregames {
      display: flex;
      align-items: center;
      margin-left: 2rem;
      color: #a903d2;
      font-size: 1rem;
      span {
        margin-right: 0.5rem;
      }
    }
    img {
      margin-right: 0.5rem;
    }
  }
  .gameWrap {
    display: inline-block;
    width: calc(100%);
    height: 120px;
    white-space: nowrap;
    margin-top: 10px;
    font-size: 0;
    overflow-x: auto;
    //自定義scrollbar 寬度
    &::-webkit-scrollbar {
      display: block;
      height: 10px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.9);
    }
    &::-webkit-scrollbar-thumb {
      // background: rgb(31, 120, 224);
      background: rgba(255, 255, 255, 0.5);
      border-radius: 20px;
    }
    .gameItem {
      width: calc(100px);
      display: inline-block;
      // height: 200px;
      margin-right: 5px;
      margin-left: 5px;
      position: relative;

      .tipWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
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
