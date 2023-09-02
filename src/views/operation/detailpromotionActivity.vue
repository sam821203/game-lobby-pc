<template>
  <div class="detailpromotionActivity">
    <img :src="getAnnouncementImageUrl(data.picture_id)" class="picture_id" />
    <h2>{{ data.title }}</h2>
    <p class="time">
      {{ formatTime(data.start_time) }}
      ~
      {{ formatTime(data.end_time) }}
    </p>
    <BaseCard class="content">
      <div v-html="data.data"></div>
      <BaseButton mode="rounded light" @click="goBack">
        {{ $t("activityList.claimBonus") }}
      </BaseButton>
    </BaseCard>
    <div class="btns-group">
      <BaseButton
        :imgSrc="'activityList/double_arrow_up'"
        :imgSize="'24'"
        :hasImg="true"
        mode="rounded secondary"
        :class="{ isDisabled: prevDisabled }"
        @click="navigatePromo(-1)"
      >
        {{ $t("activityList.previous") }}
      </BaseButton>
      <BaseButton mode="rounded" @click="goBack">
        {{ $t("返回") }}
      </BaseButton>
      <BaseButton
        :imgSrc="'activityList/double_arrow_down'"
        :imgSize="'24'"
        :hasImg="true"
        mode="rounded secondary"
        :class="{ isDisabled: nextDisabled }"
        @click="navigatePromo(1)"
      >
        {{ $t("activityList.next") }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPlayerId } from "@/utils/cookie";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { readAnnouncementApi } from "@/api/announcement";

import BaseButton from "@/components/form/baseButton.vue";

const { useAnnouncement } = useStore();
const { getAnnouncementData } = useAnnouncement();
const { eventData } = storeToRefs(useAnnouncement());
const route = useRoute();
const router = useRouter();
const data = ref({ picture_id: "", start_time: "", end_time: "", data: "" });
const prevDisabled = ref(false);
const nextDisabled = ref(false);

const getAnnouncementImageUrl = (pid) => {
  var url = process.env.VUE_APP_GETEVENTIMG;
  return pid === "" ? undefined : url + pid;
};

const formatTime = (time) =>
  new Date(time).toLocaleString("zh", { hour12: false });

const goBack = () => router.push("/activity/activityList");

// 切換上下一則公告
const currentPath = router.currentRoute.value.path;
const dataLength = eventData.value.length;
const isFirstPage = Number(route.query.key) === 0;
const isLastPage = Number(route.query.key) === dataLength - 1;

if (isFirstPage) prevDisabled.value = true;
if (isLastPage) nextDisabled.value = true;

const navigatePromo = (diff) => {
  const currentKey = Number(route.query.key) + diff;

  if (currentKey === 0) {
    data.value = eventData.value[0];
    prevDisabled.value = true;
    nextDisabled.value = false;
    router.push(`${currentPath}?key=0`);
    return;
  }
  if (currentKey >= dataLength - 1) {
    data.value = eventData.value[dataLength - 1];
    prevDisabled.value = false;
    nextDisabled.value = true;
    router.push(`${currentPath}?key=${dataLength - 1}`);
    return;
  }

  data.value = eventData.value[currentKey];
  router.push(`${currentPath}?key=${currentKey}`);
};

onMounted(async () => {
  if (eventData.value.length == 0) {
    router.push("/activity/activityList");
  } else {
    data.value = eventData.value[route.query.key];
  }
  if (getPlayerId()) await readAnnouncementApi(data.value.id);
  getAnnouncementData();
  if (eventData.value[route.query.key] == undefined) {
    router.push("/activity/activityList");
  }
  document.querySelectorAll("div[dir]").forEach((item) => {
    item.style.overflow = "scroll";
  });
});
</script>

<style lang="scss" scoped>
.detailpromotionActivity {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  text-align: center;
  .picture_id {
    width: 100%;
    height: 350px;
    margin-bottom: 8px;
    object-fit: cover;
    object-position: 50% 0%;
  }
  h2 {
    margin: 0 0 4px 0;
    font-size: 16px;
    line-height: 150%;
    color: $primary-title;
  }
  .time {
    margin-bottom: 24px;
    font-size: 12px;
    color: $secondary-text;
    & + div {
      margin-bottom: 32px;
    }
  }
  .btns-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .isDisabled {
      background-color: $button-disabled;
      filter: contrast(0.3);
      pointer-events: none;
    }
  }
}
</style>
