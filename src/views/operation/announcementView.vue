<template>
  <Announcement />
  <MiddleBar />
  <div class="announcement">
    <div>
      <BaseHeader :content="'公告'" :imgSrc="'modal/notice'" />
      <ul v-if="normalData.length">
        <li v-for="item in normalData" :key="item.title">
          <router-link
            :to="{ name: 'announcementDetail', params: { id: item.id } }"
          >
            <BaseTag mode="rounded">
              {{ item.type }}
            </BaseTag>
            <div>
              <p class="">{{ item.title }}</p>
              <p
                v-if="!readedData.includes(String(item.id)) && getPlayerId()"
                alt="new"
                class="text-warning"
              >
                {{ $t("新") }}
              </p>
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else class="noData">Sem Anúncio</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
// import { useRoute } from "vue-router";
// import { readAnnouncementApi } from "@/api/announcement";
import { getPlayerId } from "@/utils/cookie";

import Announcement from "@/views/home/components/announcement.vue";
import MiddleBar from "@/views/home/components/middleBar.vue";

const { useAnnouncement } = useStore();
// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;
// const { setNormalDetailData } = announcementStore;

const announcementStore = useAnnouncement();
const { normalData, readedData } = storeToRefs(announcementStore);

// const normalData = reactive([
//   {
//     data: "<p>Get ready for an electrifying music night that'll have you dancing till dawn. Whether you're a music enthusiast or simply seeking a lively time, this event promises non-stop beats and unforgettable moments. Join us for a night of live music, camaraderie, and sheer entertainment. Step into the enchanting world of theater as we present a series of captivating performances that will transport you to different realms of emotions and stories. Immerse yourself in the spellbinding narratives brought to life by talented actors and directors. From thought-provoking dramas to sidesplitting comedies, our theater nights promise an unforgettable blend of thoughtfulness and entertainment. Join us for evenings that celebrate the beauty and power of storytelling through the performing arts.</p>",
//     end_time: "2023-09-02T00:59:59Z",
//     id: 19,
//     type: "19",
//     title: "Exciting Music Night: Let's Rock and Roll!",
//   },
//   {
//     data: "<p>Indulge your artistic side at our captivating art exhibition. From paintings to sculptures, it's a journey through diverse cultures and creative expressions. Delight in the intricate details and stories behind each piece. Experience the fusion of entertainment and artistic inspiration.</p>",
//     end_time: "2023-09-03T00:59:59Z",
//     id: 20,
//     type: "20",
//     title: "Art Exhibition: Immerse in Culture and Creativity",
//   },
//   {
//     data: "<p>Join us for a heartwarming family fun day! This event is designed to bring families together with exciting games, delectable treats, and special performances. Strengthen bonds, create lasting memories, and enjoy quality entertainment with your loved ones. Experience a night of non-stop laughter as we bring you a comedy showcase that features a lineup of hilarious stand-up comedians. Get ready for an evening filled with witty anecdotes, relatable humor, and uproarious punchlines. Gather your friends, as we promise an atmosphere of merriment and good times. This showcase is not just about entertainment; it's about sharing hearty laughs and creating memories that will resonate for years to come.</p>",
//     end_time: "2023-09-02T00:59:59Z",
//     id: 21,
//     type: "21",
//     title: "Family Fun Day: Bonding and Laughter for All Ages",
//   },
//   {
//     data: "<p>Step into a world of cinematic wonders at our movie night! The silver screen comes alive with a selection of films that'll take you on emotional journeys. Whether you're a fan of classics or crave the latest releases, this movie night promises an evening of captivating entertainment. Join us for an unforgettable movie experience! Indulge in a cultural celebration like no other at our fusion gala event. Experience a mesmerizing blend of music, dance, and art that transcends boundaries and takes you on a global journey of entertainment. From traditional performances that honor heritage to contemporary expressions that push boundaries, our gala celebrates the diversity of entertainment that enriches our lives. Join us for an immersive experience that will tantalize your senses and expand your horizons.</p>",
//     end_time: "2023-09-03T00:59:59Z",
//     id: 22,
//     type: "22",
//     title: "Movie Night Spectacle: Cinematic Delights Await",
//   },
// ]);

// const route = useRoute();
// const navigateToDetail = (detail) => `${route.path}/${detail.id}`;

// 開啟詳細公告
// const openAnnouncementPopOut = async (detail) => {
//   console.log(detail);
//   setNormalDetailData(detail);
//   toggleModal(true);
//   if (getPlayerId()) await readAnnouncementApi(detail.id);
//   console.log(detail);
//   modalType("AnnouncementDetailPopOut", "longContent");
//   getAnnouncementData();
// };
</script>

<style lang="scss" scoped>
.announcement {
  width: 100%;
  padding: 12px 8px;
  ul {
    margin: 0;
    li {
      margin-bottom: 12px;
    }
    a {
      display: flex;
      justify-content: space-between;
      padding-left: 12px;
      padding-right: 12px;
      color: $primary-white;
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
            background: darken($modal-key, 6%);
          }
        }
      }
    }
  }
  .noData {
    text-align: center;
    padding-top: 20%;
    color: $primary;
  }
}
.text-warning {
  color: $warning;
  font-size: 12px;
}
</style>
