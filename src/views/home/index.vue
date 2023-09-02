<template>
  <div class="home">
    <Announcement />
    <MiddleBar />
    <!-- 遊戲列表 -->
    <gameLobbyIndexModal />
    <!-- 排行榜 -->
    <leaderboardComp />
    <!-- 聲明宣言 -->
    <FooterComp />
    <!-- 塞sse觸發 -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import Announcement from "./components/announcement.vue";
import MiddleBar from "./components/middleBar.vue";
import gameLobbyIndexModal from "@/views/home/modal/gameLobbyIndexModal";
import FooterComp from "@/layouts/components/footerComp.vue";
import leaderboardComp from "@/views/info/leaderBoardComp";
import Footer from "@/layouts/components/footer.vue";

import { useStore } from "@/store/index";
import { useRoute } from "vue-router";

const { useGame, useModal } = useStore();

const route = useRoute();

const game = useGame();

const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const categoryType = computed(() => route.params.category);
watch(categoryType.value, (val) => {
  if (val) {
    game.$patch({
      category: categoryType.value,
    });
  }
});

onMounted(() => {
  //開關模組
  toggleModal(true);
  //打開組件，可參考modalStore.js
  modalType("AnnouncementBrief");
});
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 0.5rem;

  .copyright {
    color: #a6a6a6;
    text-align: center;
    font-size: 12px;
    margin-top: 3%;
  }
}
</style>
