<template>
  <Announcement />
  <MiddleBar />
  <div class="announcement-wrap">
    <div>
      <BaseHeader :content="'公告'" :imgSrc="'modal/notice'" />
      <ul v-if="normalData.length">
        <li
          v-for="(item, i) in normalData"
          :key="i"
          @click="openAnnouncement(item, i)"
        >
          <BaseTag mode="rounded">
            {{ item.type }}
          </BaseTag>
          <div>
            <p v-sliceLast:[142]="item.title"></p>
            <p
              v-if="!readedData.includes(String(item.id)) && getPlayerId()"
              alt="new"
              class="text-warning"
            >
              {{ $t("新") }}
            </p>
          </div>
        </li>
      </ul>
      <p v-else class="no-data">Sem Anúncio</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
import { getPlayerId } from "@/utils/cookie";
import { readAnnouncementApi } from "@/api/announcement";

import Announcement from "@/views/home/components/announcement.vue";
import MiddleBar from "@/views/home/components/middleBar.vue";

const router = useRouter();
const { useAnnouncement } = useStore();
const announcementStore = useAnnouncement();
const { setNormalDetailData, getAnnouncementData } = announcementStore;
const { normalData, readedData } = storeToRefs(announcementStore);

// 開啟詳細公告
const openAnnouncement = async (detail, index) => {
  setNormalDetailData(detail);
  if (getPlayerId()) await readAnnouncementApi(detail.id);
  getAnnouncementData();
  router.push(`/info/announcementDetail?key=${index}`);
};
</script>

<style lang="scss" scoped>
.announcement-wrap {
  max-width: 100%;
  padding: 12px 8px;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 12px;
  background: $group-content-box-bg;
  border-radius: $border-radius-md;
  ul {
    margin: 0;
    li {
      display: flex;
      justify-content: space-between;
      padding-left: 12px;
      padding-right: 12px;
      margin-bottom: 12px;
      color: $title2;
      text-decoration: none;
      cursor: pointer;
      div {
        &:first-child {
          width: calc(20% - 12px);
          transition: all 0.2s ease;
        }
        &:last-child {
          width: calc(80% - 12px);
        }
      }
      &:hover {
        div {
          &:first-child {
            background: $button-selected-bg-darken;
            filter: brightness(94%);
          }
        }
      }
    }
  }
  .no-data {
    text-align: center;
    padding-top: 20%;
    color: $primary;
  }
}
.text-warning {
  color: $error-color;
  font-size: 12px;
}
</style>
