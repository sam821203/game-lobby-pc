<template>
  <Announcement />
  <MiddleBar />
  <div class="detail">
    <div class="header">
      <BaseTag mode="rounded">
        {{ data.type }}
      </BaseTag>
      <div>{{ data.title }}</div>
      <div v-time="data.time"></div>
    </div>
    <p class="content" v-html="data.content"></p>
    <div class="btn">
      <BaseButton mode="rounded" @click="router.go(-1)">
        {{ $t("返回") }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";

import Announcement from "@/views/home/components/announcement.vue";
import MiddleBar from "@/views/home/components/middleBar.vue";
import BaseButton from "@/components/form/baseButton.vue";

const route = useRoute();
const router = useRouter();
const { useAnnouncement } = useStore();
const announcementStore = useAnnouncement();
const { normalData } = storeToRefs(announcementStore);

const data = ref({
  type: null,
  title: "",
  time: "",
  content: "",
});

if (normalData.value.length === 0) {
  router.push("/info/announcement");
} else {
  const currentData = normalData.value[route.query.key];
  data.value = {
    type: currentData.type,
    title: currentData.title,
    time: currentData.start_time,
    content: currentData.data,
  };
}
</script>

<style lang="scss" scoped>
.detail {
  padding: 12px 8px;
  margin-top: 32px;
  color: $title2;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  div {
    &:first-child {
      width: calc(20% - 21.3px);
    }
    &:nth-child(2) {
      width: calc(60% - 21.3px);
    }
    &:last-child {
      width: calc(20% - 21.3px);
      color: $func-button-color-default;
      font-size: 12px;
      text-align: right;
      letter-spacing: 0.8px;
      white-space: nowrap;
    }
  }
}
.content {
  padding: 32px;
  margin-bottom: 32px;
  border-radius: $border-radius-md;
  background: $group-content-box-bg;
  line-height: 150%;
}
.btn {
  text-align: center;
}
</style>
