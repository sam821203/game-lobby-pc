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
        <div class="btnGroup">
          <img
            :src="arrowFunc('hot', 'pre')"
            class="preBtn"
            @mousedown="preScroll('hot')"
            @mouseleave="stoppreScroll()"
            @mouseup="stoppreScroll()"
          />
          <img
            :src="arrowFunc('hot', 'next')"
            class="nextBtn"
            @mousedown="nextScroll('hot')"
            @mouseleave="stopnextScroll()"
            @mouseup="stopnextScroll()"
          />
        </div>
      </div>
      <ul class="gameWrap gameWrap_hot">
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
                thiscategory: 'toIndex',
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
          <div class="moregames" @click="entryHandler(k)">
            <span>{{ $t("更多遊戲") }} </span>
            <img
              :src="require(`@/assets/images/mainMenu/background/arrow_1.png`)"
            />
          </div>
        </div>
        <div class="btnGroup">
          <img
            :src="arrowFunc(k, 'pre')"
            class="preBtn"
            @mousedown="preScroll(k)"
            @mouseleave="stoppreScroll()"
            @mouseup="stoppreScroll()"
          />
          <img
            :src="arrowFunc(k, 'next')"
            class="nextBtn"
            @mousedown="nextScroll(k)"
            @mouseleave="stopnextScroll()"
            @mouseup="stopnextScroll()"
          />
        </div>
      </div>
      <ul :class="['gameWrap', `gameWrap_${k}`]">
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
              thiscategory: 'toIndex',
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

const { depositPageStatus } = storeToRefs(usectrlLogin());
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
  thiscategory,
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
    // 可能要改
    // const { category, studio: targetStudio } = 12;
    const category =
      thiscategory === "toIndex" ? "toIndex" : categoryTans(thiscategory);
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
//
const whichClick = ref([]);
const prefunc = ref(null);
const preScroll = (v) => {
  whichClick.value = [v, "pre"];
  if (document.getElementsByClassName(`gameWrap_${v}`)[0]) {
    document.getElementsByClassName(`gameWrap_${v}`)[0].scrollLeft -= 100;
  }
  prefunc.value = setInterval(() => {
    if (document.getElementsByClassName(`gameWrap_${v}`)[0]) {
      document.getElementsByClassName(`gameWrap_${v}`)[0].scrollLeft -= 100;
    }
  }, 200);
};
const stoppreScroll = () => {
  whichClick.value = [];
  clearInterval(prefunc.value);
};
//\
const arrowFunc = (e, k) => {
  return require(`@/assets/images/mainMenu/${
    whichClick.value[0] == e && whichClick.value[1] == k
      ? "icon_arrow_2"
      : "icon_arrow_1"
  }.png`);
};
//
const nextfunc = ref(null);
const nextScroll = (v) => {
  whichClick.value = [v, "next"];
  clearInterval(nextfunc.value);
  if (document.getElementsByClassName(`gameWrap_${v}`)[0]) {
    document.getElementsByClassName(`gameWrap_${v}`)[0].scrollLeft += 100;
  }
  nextfunc.value = setInterval(() => {
    if (document.getElementsByClassName(`gameWrap_${v}`)[0]) {
      document.getElementsByClassName(`gameWrap_${v}`)[0].scrollLeft += 100;
    }
  }, 200);
};
const stopnextScroll = () => {
  whichClick.value = [];
  clearInterval(nextfunc.value);
};
</script>

<style lang="scss" scoped>
.gameLobby {
  position: relative;
  width: calc(100% - 10px);
  padding: 10px 5px 0 5px;
  overflow-y: auto;
  margin: auto;
  .optionBar {
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
  }
  .noticeChooseType {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.5rem;
    .title {
      display: flex;
      align-items: center;
      width: 8rem;
      font-size: 1.3rem;
      .moregames {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        color: #a903d2;
        font-size: 1rem;
        span {
          white-space: nowrap;
          margin-right: 0.5rem;
        }
      }
    }
    .btnGroup {
      display: flex;
      align-items: center;
      justify-content: center;
      .preBtn {
        // tra
        user-select: none;
        -webkit-user-drag: none;
      }
      .nextBtn {
        transform: scale(-1);
        user-select: none;
        -webkit-user-drag: none;
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
      display: none;
      height: 10px;
    }
    &::-webkit-scrollbar-track {
      background: $scrollbar-track-bg;
    }
    &::-webkit-scrollbar-thumb {
      background: $scrollbar-thumb-bg;
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
