<template>
  <!-- 登入輸入密碼錯誤時，跳出的警示(或成功) -->
  <!-- == '' ? '10px' : positionTop  -->
  <div
    :style="{ top: positionTop }"
    :class="[
      'popoutNotice',
      borderType == 1 ? 'borderRed' : '',
      borderType == 2 ? 'borderGreen' : '',
    ]"
  >
    <div class="top">
      <img
        src="@/assets/images/popoutNotice/error_2.png"
        alt=""
        v-if="statusType == 1"
      />
      <img
        src="@/assets/images/popoutNotice/success_2.png"
        alt=""
        class="success"
        v-if="statusType == 2"
      />
      <span>
        {{ statusStr }}
      </span>
    </div>
    <div
      class="bottom"
      v-if="countDownWidth > 0"
      :style="{
        background: borderTypeColor(),
        width: `${thiscountDownWidth}%`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { usepopoutNotice } from "@/store/popoutNotice";
const { statusType, statusStr, positionTop, borderType, countDownWidth } =
  storeToRefs(usepopoutNotice());
const { resetpopoutNotice } = usepopoutNotice();
const borderTypeColor = () => {
  if (borderType.value == 0) {
    return "transparent";
  } else if (borderType.value == 1) {
    return "red";
  } else if (borderType.value == 2) {
    return "green";
  }
};
//
const thiscountDownWidth = ref();
const decreaseCountDownWidth = () => {
  const interval = setInterval(() => {
    thiscountDownWidth.value -= 1;
    if (thiscountDownWidth.value < 0) {
      thiscountDownWidth.value = 0;
      resetpopoutNotice();
      clearInterval(interval);
    }
  }, 30);
};
watch(countDownWidth, (v) => {
  // 有倒數，才改變寬度
  if (v > 0) {
    thiscountDownWidth.value = countDownWidth.value;
    decreaseCountDownWidth();
  }
});
onMounted(() => {});
</script>
<style lang="scss" scoped>
.popoutNotice {
  position: absolute;
  background: $popoutTop-color;
  left: 50%;
  transform: translateX(-50%);
  height: 3.5rem;
  width: 400px;
  box-sizing: content-box;
  color: white;
  border-radius: $border-radius-md;
  overflow: hidden;
  z-index: 3;
  @include breakpoint-up("xs") {
    padding: 0 1rem;
  }
  @include breakpoint-up("sm") {
    padding: 0 3rem;
  }
  &.borderGreen {
    border: 1px solid green;
  }
  &.borderRed {
    border: 1px solid $error-color;
  }
  > .top {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 60%;
      object-fit: contain;
      margin-right: 0.5rem;
    }
    .success {
      height: 40%;
      object-fit: contain;
      margin-right: 0.5rem;
    }
  }
  .bottom {
    position: absolute;
    width: 20%;
    height: 5px;
    bottom: 0;
    right: 0;
  }
}
</style>
