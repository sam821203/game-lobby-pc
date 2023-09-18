<template>
  <ModalLayout v-if="announcementBriefPage" :pageHeight="'450px'">
    <template #default>
      <!-- slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  }, -->
      <!-- :slidesPerView="3" -->
      <!-- :spaceBetween="30" -->
      <div class="annoucementBrief">
        <swiper
          style="width: 100%"
          :navigation="true"
          :modules="bannerModules"
          class="swiper"
          :loop="false"
          :freeMode="false"
          :slidesPerView="1.3"
          :centeredSlides="true"
          effect="coverflow"
          :coverflowEffect="{
            // rotate: 0,
            // stretch: 400,
            // depth: 400,
            // modifier: 1.3,
            // slideShadows: false,
          }"
        >
          <!-- :autoplay="{ delay: 3000, disableOnInteraction: false }" -->
          <!-- :pagination="true" -->
          <swiper-slide
            class="item"
            v-for="(value, key) in eventData"
            :key="key"
            @click="detailPromotion(key)"
          >
            <span> {{ currentIndex }}</span>
            <img
              :src="Announcement_PicIdToUrl(value.picture_id)"
              class="anouceMentPic"
            />
            <div class="anouceMentTitle">{{ value.title }}</div>
            <div class="anouceMentTime">
              {{ new Date(value.start_time).toLocaleDateString("pt-BR") }}
              ~
              {{ new Date(value.end_time).toLocaleDateString("pt-BR") }}
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="bottom">
        <button class="confirm-button" @click="closewindow(false)">
          <span>{{ $t("OK") }}</span>
        </button>
        <!--有登入(token)才顯示Checkbox，確認按鈕置中-->
        <div class="checkbox" v-if="token">
          <!-- <img
            src="@/assets/images/form/remind_box.png"
            v-if="!m_Checked"
            @click="m_Checked = true"
          /> -->
          <div
            class="remind_box remind"
            v-if="!m_Checked"
            @click="m_Checked = true"
          ></div>
          <div class="remind_tick remind" v-else @click="m_Checked = false">
            <div></div>
          </div>
          <!-- <img
            src="@/assets/images/form/remind_tick.png"
            v-else
            @click="m_Checked = false"
          /> -->
          <label @click="m_Checked = !m_Checked">{{
            $t("今日不再顯示")
          }}</label>
        </div>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { getCookie, setCookieExpireDays } from "@/utils/cookie";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ModalLayout from "@/components/modal/layout";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay, Navigation } from "swiper";
import { useModal } from "@/store/modalStore";
const { announcementBriefPage } = storeToRefs(useModal());
import "swiper/css";
import "swiper/css/navigation";
import "swiper/scss/pagination";
const bannerModules = [Pagination, Autoplay, Navigation];

const m_Checked = ref(false);
const { useAnnouncement, useAuth } = useStore();
const { eventData } = storeToRefs(useAnnouncement());
const authStore = useAuth();
const { token } = storeToRefs(authStore);

const closewindow = (iIsOpen) => {
  //如果有打勾"今日不再顯示"，設定cookie
  if (m_Checked.value === true) {
    //setCookie沒有辦法存boolean
    setCookieExpireDays("hash_popup", "Close", 1); //1天
  }
  announcementBriefPage.value = iIsOpen;
};

onBeforeMount(async () => {
  let _StrIsChecked = getCookie("hash_popup");
  //如果有勾選"今日不再顯示"，關閉視窗
  if (_StrIsChecked === "Close") {
    closewindow(false);
  }
});

//後端圖片ID轉成網址
const Announcement_PicIdToUrl = (pid) => {
  var url = process.env.VUE_APP_GETEVENTIMG;
  return url + pid;
};
//活動內容跳轉
const router = useRouter();
const detailPromotion = function (k) {
  router.push(`/activity/detailpromotionActivity?key=${k}`);
  announcementBriefPage.value = false;
};
</script>

<style lang="scss" scoped>
.annoucementBrief {
  width: 100%;
  height: 300px;
  overflow-y: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .anouceMentTitle {
    width: 70%;
    margin-top: 10px;
    text-align: center;
    color: $primary;
  }
  .anouceMentTime {
    width: 70%;
    margin-top: 10px;
    text-align: center;
    color: $func-button-color-default;
  }
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  transform: scale(0.5);
}
.bottom {
  display: flex;
  // justify-content: space-around;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  background: $popoutBottom-color;
  height: 140px;
  // margin-top: 10%;

  .confirm-button {
    width: 50%;
    height: 30%;
    margin-top: 10px;
    color: white;
    font-weight: bolder;
    background: $confirm-btn-bg;
    border-radius: $border-radius-md;
    span {
      font-size: 1.3rem;
    }
  }
  .checkbox {
    height: 30%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    object-fit: contain;
    img {
      height: 90%;
      object-fit: contain;
      margin-right: 2.5px;
    }
    .remind {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid $modal-key;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .remind_box {
      // margin-right: 5px;
    }
    .remind_tick {
      > div {
        width: 70%;
        height: 70%;
        background: $confirm-btn-bg;
      }
    }
    label {
      user-select: none;
      font-weight: bolder;
      //vmin 他會隨著從螢幕的寬度、高度，兩者之間取較小的那個當作參考單位
      font-size: 0.8rem;
      white-space: nowrap; //文字不換行
      margin-left: 5px;
    }
  }
}
//自定義scrollbar 寬度
// ::-webkit-scrollbar {
//   width: 10px;
//   display: block; //打開
// }
//自定義scrollbar的旋鈕
// ::-webkit-scrollbar-thumb {
//   background: #5496d1;
//   border-radius: $border-radius-md;
// }
//畫面高度過小，調整ScrollView高度
@media (max-height: 550px) {
  ul {
    height: 60%;
  }
}
.anouceMentPic {
  // height: 50%;
  width: 80%;
  object-fit: contain;
}
// .swiper-slide item large
.item {
  // overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.swiper-slide-active {
  .anouceMentPic {
    width: 90%;
    object-fit: contain;
  }
}
</style>
