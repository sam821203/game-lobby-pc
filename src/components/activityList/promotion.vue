<template>
  <div class="promotion" ref="promo">
    <BaseHeader
      :content="'activityList.promotion'"
      :imgSrc="'activityList/promotions_1'"
    />
    <div
      v-for="(v, k) in eventData"
      :key="k"
      class="detail"
      @click="detailPromotion(k)"
    >
      <img :src="getAnnouncementImageUrl(v.picture_id)" class="picture_id" />
      <!-- http://192.168.88.217/picture/announcement/0798952a6d694ff5a959da9bd5e8513a -->
      <!-- http://192.168.88.217/picture/announcement/22dbf61d2c8e48c8b2da13268564b5f7 -->
      <!-- <img :src=`http://192.168.88.217/picture/announcement/${k}` alt="" srcset="" /> -->
      <!-- v-if="!readedData.includes(String(item.id)) && getPlayerId()" -->
      <h2 v-sliceLast:[64]="v.title"></h2>
      <div class="img_wrap">
        <img
          src="@/assets/images/new.png"
          alt="new"
          class="new"
          v-if="!readedData.includes(String(v.id)) && getPlayerId()"
        />
      </div>
      <div class="time">
        <span v-time="new Date(v.start_time)"></span>
        ~
        <span v-time="new Date(v.end_time)"></span>
      </div>
    </div>

    <!-- <img
      src="@/assets/images/activityList/up_button.png"
      class="top_btn"
      @click="scrollToTop"
    /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { getPlayerId } from "@/utils/cookie";
import { storeToRefs } from "pinia";

const { useAnnouncement } = useStore();
const { setPromotionScrollTop } = useAnnouncement();
const { eventData, readedData, promotionScrollTop } = storeToRefs(
  useAnnouncement()
);
const router = useRouter();

const getAnnouncementImageUrl = (pid) => {
  var url = process.env.VUE_APP_GETEVENTIMG;
  return url + pid;
};
// const scrollToTop = function () {
//   promo.value.scrollTo({
//     top: 0,
//     left: 0,
//     behavior: "smooth",
//   });
// };

const promo = ref(null);
const detailPromotion = function (k) {
  setPromotionScrollTop(promo.value.scrollTop);
  router.push(`/activity/detailpromotionActivity?key=${k}`);
};

const setActivityData = async () => {
  for (let i = 0; i < eventData.value.length; i++) {
    return;
  }
};

const promotionHeight = ref("");
const adjustHeight = async () => {
  promotionHeight.value = `calc(${window.innerHeight}px - 13.5rem)`;
};
watch(eventData, () => {
  if (getPlayerId() != undefined) {
    setActivityData();
  }
});
onMounted(async () => {
  // console.log(getPlayerId());
  await adjustHeight();
  window.addEventListener("resize", () => {
    adjustHeight();
  });
  // setTimeout(() => {
  // console.log(router.options.history.state.);
  await promo.value.scrollTo({
    top: promotionScrollTop.value,
    left: 0,
    behavior: "auto",
  });
  // }, 10);
});
</script>

<style lang="scss" scoped>
.promotion {
  position: relative;
  width: 100%;
  height: v-bind(promotionHeight);
  padding: 0 1rem;
  margin-top: 20px;
  overflow: auto;
  .detail {
    margin-bottom: 32px;
    cursor: pointer;
  }
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
  .new {
    float: right;
    height: 1rem;
  }
  .time {
    font-size: 15px;
    color: $secondary-text;
  }
  .top_btn {
    position: sticky;
    width: 10%;
    object-fit: contain;
    bottom: 10%;
    left: 85%;
    display: inline-block;
  }
}
</style>
