<template>
  <Loading class="loading" v-if="loadingStatus" />
  <Version />
  <audio ref="lobbyBgm" :src="require('@/assets/sound/lobby.mp3')" loop></audio>
  <audio
    :src="require('@/assets/sound/cancel.mp3')"
    ref="cancelBtnSound"
  ></audio>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <div>
    <Navbar
      v-if="navStatus"
      :listStatus="listStatus"
      v-model:listStatus="listStatus"
      :mylistStatus="mylistStatus"
      v-model:mylistStatus="mylistStatus"
    />
    <!-- 左側選單 -->
    <detailList :listStatus="listStatus" v-model:listStatus="listStatus" />
    <detailmyList
      :mylistStatus="mylistStatus"
      v-model:mylistStatus="mylistStatus"
    />
  </div>
  <div id="main">
    <MessageComp v-if="content || slot" />
    <Teleport to="#app">
      <Modal v-if="isModalOpen" />
    </Teleport>
    <!-- 登入介面 -->
    <transition name="slide">
      <!-- click常常誤點，所以用point判斷 -->
      <div
        class="slideDiv"
        ref="pageRef"
        v-if="slideDiv"
        @pointerdown.self="checkTouchLogin = true"
        @pointerup.self="openLoginpage"
      >
        <popoutNotice />
        <!-- 登入登出 -->
        <authLayout />
        <!-- 基本資料 -->
        <userInfoView />
        <!-- 修改密碼 -->
        <loginPwd />
        <!-- 修改交易密碼 -->
        <tradePwd />
      </div>
    </transition>
    <!-- 其他介面 -->
    <router-view />

    <!--小遊戲-->
    <MiniGame v-if="routeName === 'home'" />
    <!-- 客服 -->
    <customerService />
    <!--  -->
    <div class="serviceiframe" v-if="serviceConectStatus">
      <img
        src="@/assets/images/modal/closurel_button.png"
        class="closeBtn"
        @click="setserviceConectData(false)"
      />
      <!-- 正式站 -->
      <iframe
        src="https://direct.lc.chat/15657093/"
        frameborder="0"
        ref="iframe"
        allow="autoplay"
      ></iframe>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, provide, watch, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import Modal from "@/components/modal/index.vue";
import Navbar from "@/layouts/components/navbar.vue";
import detailList from "@/layouts/components/detailnavList.vue";
import detailmyList from "@/layouts/components/detailmyList.vue";
import MessageComp from "@/components/popout/messageComp.vue";
import popoutNotice from "@/components/popout/popoutNotice.vue";
import authLayout from "./layouts/authLayout.vue";
import userInfoView from "@/views/info/userInfo";
import loginPwd from "@/views/info/modal/loginPwd";
import tradePwd from "@/views/info/modal/tradePwd";
import { useModal } from "@/store/modalStore";
import { useMessage } from "@/store/msgStore";
import { useSounds } from "@/store/soundsStore";

import { serviceConect } from "@/store/serviceConnet";
import mitt from "mitt";
// import { getBgmState, getSeState, setBgmState } from "@/utils/cookie";
import reseizeWindow from "@/utils/reseizeWindow";
import device from "current-device";
import forbidScale from "@/utils/forbidScale";
import Version from "@/views/Version";
import Loading from "@/components/loading";
import { useLoading } from "@/store/loadingStore";
import MiniGame from "@/views/minigame/minigame";
import customerService from "@/layouts/components/customerService.vue";
import { useRoute } from "vue-router";
// import { getPlayerId } from "@/utils/cookie";
import { usectrlLogin } from "@/store/ctrlLogin";
const loadingStore = useLoading();
const { loadingStatus } = storeToRefs(loadingStore);
const route = useRoute();

import { useStore } from "@/store";

// import { useDeposit } from "@/store/depositStore";
// const depositStore = useDeposit();
// const { getTime } = depositStore;
// getTime();
const modalStore = useModal();
const messageStore = useMessage();
const { isModalOpen } = storeToRefs(modalStore);
const { content, slot } = storeToRefs(messageStore);
const { setserviceConectData } = serviceConect();
const { serviceConectStatus } = storeToRefs(serviceConect());
const soundsStore = useSounds();
const { bgmSound, SeButtonValue, forceCloseBgm } = storeToRefs(soundsStore);
const lobbyBgm = ref(null);
const cancelBtnSound = ref(null);
const emitter = mitt();
const { useAuth } = useStore();

const {
  loginpageStatus,
  bgmStatus,
  userInfosetting,
  changeLoginPwd,
  changeTradePwd,
} = storeToRefs(usectrlLogin());

const authStore = useAuth();
const { getUserInfo } = authStore;
const { token, userInfo } = storeToRefs(authStore);
// 新-提示窗
import { usepopoutNotice } from "@/store/popoutNotice";
const { resetpopoutNotice } = usepopoutNotice();
// const { positionTop } = storeToRefs(usepopoutNotice());
// const { getBgmSetting } = soundsStore;
provide("emitter", emitter);
// 禁止放大瀏覽器
forbidScale();

// 要單獨處理

onMounted(async () => {
  // let script = document.createElement("script");
  // script.type = "text/javascript";
  // script.src = "https://chat.d8.run/dist/js/widget.js";
  // document.body.appendChild(script);
  // const userIdentity = "0000-1111-2222-3333";

  // window.onload = () => {
  //   window.d8Chat.init("#chat", userIdentity);
  // };
  reseizeWindow();
  window.addEventListener("resize", () => {
    if (device.mobile()) {
      reseizeWindow();
    }
  });
  if (token.value) {
    await getUserInfo();
    nextTick(() => {
      if (token.value) {
        if (userInfo.value.music === true) {
          const clickToPlayBGM = () => {
            lobbyBgm.value.play();
            // setBgmState(true);
            soundsStore.$patch({
              bgmSound: true,
            });
            window.removeEventListener("click", clickToPlayBGM);
          };
          window.addEventListener("click", clickToPlayBGM);
        } else {
          lobbyBgm.value.pause();
          soundsStore.$patch({
            bgmSound: false,
          });
        }
        if (userInfo.value.sound_fx === true) {
          soundsStore.$patch({
            SeButtonValue: "on",
          });
          cancelBtnSound.value.play();
        } else {
          soundsStore.$patch({
            SeButtonValue: "off",
          });
          cancelBtnSound.value.pause();
        }
      }
    });
  }
});

watch(route, (v) => {
  if (v.params.id) {
    // 若有在網址後面攜帶 id
    console.log(v.name);
    if (v.name == "home") {
      usectrlLogin().$patch({
        loginpageStatus: true,
        // inviteFriendid: v.params.id,
      });
    }
  }
});

const routeName = computed(() => route.name);
watch(
  bgmSound,
  (val) => {
    nextTick(() => {
      if (val) {
        lobbyBgm.value.play();
        soundsStore.$patch({
          bgmSound: true,
        });
      } else {
        lobbyBgm.value.pause();
        soundsStore.$patch({
          bgmSound: false,
        });
      }
    });
  },
  {
    immediate: true,
  }
);

watch(token, (val) => {
  if (!val) {
    soundsStore.$patch({
      forceCloseBgm: true,
    });
  }
});

watch(forceCloseBgm, (isClose) => {
  isClose ? lobbyBgm.value.pause() : lobbyBgm.value.play();
});

watch(isModalOpen, (val) => {
  if (!val) {
    nextTick(() => {
      if (SeButtonValue.value === "on") {
        cancelBtnSound.value.play();
      } else if (SeButtonValue.value === "off") {
        cancelBtnSound.value.pause();
      }
    });
  }
});

const navStatus = ref(false);
onMounted(async () => {
  nextTick(() => {
    navStatus.value = true;
  });
});
//
const listStatus = ref(false);
const mylistStatus = ref(false);

const slideDiv = ref(false); //最上層浮動頁的狀態
watch(
  [loginpageStatus, bgmStatus, userInfosetting, changeLoginPwd, changeTradePwd],
  ([afterV1, afterV2, afterV3, afterV4, afterV5]) => {
    // console.log(beforeV1);
    // console.log(beforeV2);
    // , [beforeV1, beforeV2, beforeV3]
    if (afterV1 || afterV2 || afterV3 || afterV4 || afterV5) {
      slideDiv.value = true;
    } else {
      slideDiv.value = false;
    }
  }
);
watch(slideDiv, (v) => {
  if (!v) {
    loginpageStatus.value = false;
    bgmStatus.value = false;
    userInfosetting.value = false;
    changeLoginPwd.value = false;
    changeTradePwd.value = false;
  }
});

// click常常誤點，所以用point判斷
const checkTouchLogin = ref(false);
const openLoginpage = () => {
  if (checkTouchLogin.value) {
    slideDiv.value = false;
    //
    resetpopoutNotice();
  }
  checkTouchLogin.value = false;
};
</script>
<style lang="scss">
html {
  background-image: url("@/assets/images/lobby_bg.jpg");
  background-size: 100%;
}
html,
body {
  margin: 0;
  // 做電腦版時移除
  /* width: 100vw; */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    // display: none;
  }
}
#app {
  font-family: Arial, Microsoft JhengHei, sans-serif;
  margin: 0 auto;
  position: relative;
  // padding: 0.25rem;
  width: 100%;
  #main {
    margin: 0 auto;
    position: relative;
    width: 100%;
    min-height: calc(100vh);
    // overflow-x: hidden;
    // word-break: keep-all;
    word-wrap: break-word;
    overflow-wrap: break-word;
    @include breakpoint-up("xs") {
      max-width: 470px;
    }
    @include breakpoint-up("sm") {
      max-width: 572px;
    }
    @include breakpoint-up("md") {
      max-width: 768px;
    }
    @include breakpoint-up("lg") {
      max-width: 992px;
    }
    @include breakpoint-up("xl") {
      max-width: 1200px;
    }
    @include breakpoint-up("xxl") {
      max-width: 1400px;
    }

    background: #23003e;
    color: $primary;
    .serviceiframe {
      position: sticky;
      display: inline-block;
      z-index: $service-index;
      bottom: 4rem;
      // background: red;
      width: 300px;
      // right: 2rem;  //不知道為啥不支援
      left: calc(100% - 2rem);
      height: 500px;
      // @include breakpoint-up("xs") {
      //   width: 0px;
      // }
      // @include breakpoint-up("sm") {
      //   width: 300px;
      // }
      // @include breakpoint-up("md") {
      //   width: 300px;
      // }
      // @include breakpoint-up("lg") {
      //   width: 300px;
      // }
      // @include breakpoint-up("xl") {
      //   width: 300px;
      // }
      // @include breakpoint-up("xxl") {
      //   width: 300px;
      // }
      // height: v-bind(servieIframeHeight);
      iframe {
        width: 100%;
        height: 100%;
      }
      .closeBtn {
        position: absolute;
        z-index: 2147483002;
        width: 10%;
        object-fit: contain;
        right: 0.5rem;
        top: 0.5rem;
      }
    }
  }
  .slideDiv {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 103;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    text-align: center;
    // width: 100%;
    // min-height: calc(100vh);
    overflow-x: hidden;
    // @include breakpoint-up("xs") {
    //   max-width: 470px;
    // }
    // @include breakpoint-up("sm") {
    //   max-width: 572px;
    // }
    // @include breakpoint-up("md") {
    //   max-width: 768px;
    // }
    // @include breakpoint-up("lg") {
    //   max-width: 992px;
    // }
    // @include breakpoint-up("xl") {
    //   max-width: 1200px;
    // }
    // @include breakpoint-up("xxl") {
    //   max-width: 1400px;
    // }
  }
}
</style>
