<template>
  <div class="footer" v-show="false">
    <ul class="listWrap">
      <li class="list-item dotCenterWrap" @click="setserviceConectData(true)">
        <p>{{ $t("footer.service") }}</p>
      </li>
    </ul>
    <lobbyStyle />
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch, onMounted } from "vue";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
// import { useDeposit } from "@/store/depositStore";
import { getPlayerId } from "@/utils/cookie";
import { serviceConect } from "@/store/serviceConnet";
import { checkWallet } from "@/api/game";
import lobbyStyle from "@/layouts/components/lobbyStyle.vue";
//

const { setserviceConectData } = serviceConect();
const route = useRoute();

const { useMail, useAuth, useAnnouncement, useSsevent } = useStore();
const mailStore = useMail();
const authStore = useAuth();
const { token, userInfo } = storeToRefs(authStore);

const announcementStore = useAnnouncement();
const { getAnnouncementData } = announcementStore;

const sseStore = useSsevent();
const { openSsevent } = sseStore;
const { sseventInstance } = storeToRefs(sseStore);
// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;
if (
  sseventInstance.value?.readyState !== 1 &&
  token.value &&
  !route.path.includes("gamelobby")
) {
  openSsevent();
}

if (token.value) {
  const { getMailNotification } = mailStore;
  getMailNotification(456);
}

const interval = setInterval(() => {
  getAnnouncementData();
}, 60000);

onBeforeUnmount(() => {
  //在Vue被摧毀前
  clearInterval(interval);
});

// 非開發環境和非 217 環境直接取得公告
const url = new URL(window.location.href);
const isDev = process.env.NODE_ENV === "development";
const isTest = url.protocol !== "http:";
if (!getPlayerId() || (!isDev && !isTest)) {
  getAnnouncementData();
}

// 開發環境或 217 環境需等候 userInfo 取得 agent_name 否則取得公告時會找不到代理
watch(
  () => userInfo.value.agent_name,
  (val) => {
    if (val && (isDev || isTest)) {
      getAnnouncementData();
    }
  },
  { immediate: true }
);
onMounted(() => {
  if (token.value) {
    checkWallet();
  }
});
</script>

<style lang="scss" scoped></style>
