<template>
  <div class="iframeWrap">
    <UseDraggable
      :initialValue="{ x: 30, y: 30 }"
      style="position: fixed"
      v-if="hasHomeBtn"
    >
      <img
        src="@/assets/images/game/exit_button.png"
        alt="back"
        class="exit"
        style="user-select: none"
        @mousedown="mousedownStart"
        @mouseup="mousedownCancel($event)"
        draggable="false"
      />
      <!-- @click="closeWindow($event, 'handleLeave')" -->
    </UseDraggable>
    <iframe
      :src="gameUrl"
      frameborder="0"
      class="iframe"
      ref="iframe"
      allow="autoplay"
    ></iframe>
    <loading v-if="isLoading" />
  </div>
</template>

<script setup>
import {
  watch,
  ref,
  nextTick,
  onBeforeUnmount,
  onMounted,
  computed,
} from "vue-demi";
import { useSsevent } from "@/store/sseventStore";
import { storeToRefs } from "pinia";
// import { useSounds } from "@/store/soundsStore";
import { useRoute, useRouter } from "vue-router";
import reseizeWindow from "@/utils/reseizeWindow";
import { useStore } from "@/store/index";
// eslint-disable-next-line no-unused-vars
import loading from "@/components/loading.vue";
import { isBoolean } from "@/utils/transType";
import { UseDraggable } from "@vueuse/components";

const { useGame, useSounds } = useStore();
const gameStore = useGame();
const { gameUrl } = storeToRefs(gameStore);

const isLoading = ref(false);

const sseventStore = useSsevent();
const { closeSsevent, openSsevent } = sseventStore;

const soundsStore = useSounds();
const { bgmSound } = storeToRefs(soundsStore);

const router = useRouter();
const route = useRoute();

const category = computed(() => route.params.category);
// const studio = computed(() => route.params.studio);
const hasHomeBtn = computed(() => isBoolean(route.query.hasHomeBtn));

const closeWindow = (e, handler) => {
  if (e.data === "closeWindow" || handler === "handleLeave") {
    gameStore.$patch({
      gameUrl: "",
    });
    soundsStore.$patch({
      forceCloseBgm: !bgmSound.value,
    });
  }
};

const iframe = ref(null);
// const prevRoute = ref(router.options.history.state.back);

onMounted(() => {
  soundsStore.$patch({
    forceCloseBgm: true,
  });
});

watch(
  gameUrl,
  (val) => {
    if (val !== "") {
      closeSsevent();
      window.addEventListener("message", closeWindow);
    } else {
      console.log("leave game room");
      nextTick(() => {
        if (iframe.value !== null) {
          iframe.value.src = "about:blank";
          iframe.value.contentWindow.close();
          isLoading.value = true;
          setTimeout(() => {
            isLoading.value = false;
            if (
              category.value !== "undefined" &&
              category.value !== "null" &&
              category.value !== "toIndex"
            ) {
              // router.push(`/gamelobby/${category.value}/${studio.value}`);
              router.push(`/gamelobby/${category.value}/`);
              openSsevent();
            } else {
              router.push("/home");
            }
          }, 1000);
        }
      });
    }
  },
  {
    immediate: true,
  }
);

const resizeIframe = () => {
  nextTick(() => {
    reseizeWindow();
  });
};

onMounted(() => {
  window.addEventListener("resize", resizeIframe);
});
onBeforeUnmount(() => {
  window.removeEventListener("message", closeWindow);
  window.removeEventListener("resize", resizeIframe);
});
//
const mouseCount = ref(0);
const mouseFunc = ref(null);
const mousedownStart = () => {
  mouseFunc.value = setInterval(() => {
    mouseCount.value += 100;
  }, 100);
};
const mousedownCancel = (ev) => {
  if (mouseCount.value <= 500) {
    closeWindow(ev, "handleLeave");
  }
  clearInterval(mouseFunc.value);
  mouseCount.value = 0;
};
</script>

<style lang="scss" scoped>
.iframeWrap {
  // height: calc(var(--vh, 1vh) * 100);
  position: sticky;
  width: 100%;
  // height: calc(100vh - $topBar-height);
  // top: $topBar-height;
  top: 0;
  height: 100vh;
  background: #000;
  // position: relative;
  .iframe {
    width: 100%;
    height: 100%;
  }
  .exit {
    width: 40px;
    width: 40px;
    opacity: 0.5;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
