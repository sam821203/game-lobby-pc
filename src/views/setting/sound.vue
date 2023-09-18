<template>
  <div class="authWrap" v-show="bgmStatus">
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("設定") }}
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="main">
      <div class="login-wrap">
        <div class="bgm">
          <div class="bgm-title">{{ $t("sound.bgm") }}</div>
          <div
            :class="['bgm-control on', { off: !bgmSound }]"
            @click="switchBGM"
          ></div>
        </div>
        <div class="se">
          <div class="se-title">{{ $t("sound.se") }}</div>
          <div
            :class="['se-control on', { off: SeButtonValue === 'off' }]"
            @click="switchSE"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { storeToRefs } from "pinia";
import { useSounds } from "@/store/soundsStore";
import { usectrlLogin } from "@/store/ctrlLogin";
const { bgmStatus } = storeToRefs(usectrlLogin());
//
const soundsStore = useSounds();
const { switchBgm, switchSe } = soundsStore;

const { SeButtonValue, bgmSound } = storeToRefs(soundsStore);

const switchBGM = () => {
  switchBgm();
};

const switchSE = () => {
  switchSe();
};
const closeModal = () => {
  bgmStatus.value = false;
};
</script>

<style lang="scss" scoped>
.login-wrap {
  // margin: 10% auto 0;
  // display: contents;
  .bgm {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8%;

    .bgm-title {
      font-size: 1.2rem;
      // color: #000;
    }

    .bgm-control {
      width: 60px;
      height: 25px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      &.on {
        background-image: url("@/assets/images/modal/ON.png");
      }
      &.off {
        background-image: url("@/assets/images/modal/OFF.png");
      }
    }
  }
  .se {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .se-title {
      font-size: 1.2rem;
      // color: #000;
      white-space: break-spaces;
    }
    .se-control {
      width: 60px;
      height: 25px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      &.on {
        background-image: url("@/assets/images/modal/ON.png");
      }
      &.off {
        background-image: url("@/assets/images/modal/OFF.png");
      }
    }
  }
}
</style>
