<template>
  <ModalLayout v-if="m_Show" :pageHeight="'700px'">
    <!-- <template #title>
      <p class="title">{{ $t("優惠活動") }}</p>
    </template> -->
    <template #default>
      <div class="annoucementBrief">
        <swiper
          :navigation="true"
          :modules="bannerModules"
          class="swiper"
          :loop="true"
        >
          <!-- :autoplay="{ delay: 3000, disableOnInteraction: false }" -->
          <!-- :pagination="true" -->
          <swiper-slide
            class="item"
            v-for="(value, key) in eventData"
            :key="key"
            @click="detailPromotion(key)"
          >
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
          <span>{{ $t("ok") }}</span>
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
import "swiper/css";
import "swiper/css/navigation";
import "swiper/scss/pagination";
const bannerModules = [Pagination, Autoplay, Navigation];

const m_Show = ref(true);
const m_Checked = ref(false);
const { useAnnouncement, useAuth } = useStore();
const { eventData } = storeToRefs(useAnnouncement());
const authStore = useAuth();
const { token } = storeToRefs(authStore);

const closewindow = (iIsOpen) => {
  console.log(123456);
  //如果有打勾"今日不再顯示"，設定cookie
  if (m_Checked.value === true) {
    //console.log("今日不再顯示是否打勾 = ", m_Checked.value);
    //setCookie沒有辦法存boolean
    setCookieExpireDays("hash_popup", "Close", 1); //1天
  }
  m_Show.value = iIsOpen;
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
  console.log(k);
  router.push(`/activity/detailpromotionActivity?key=${k}`);
  m_Show.value = false;
};
</script>

<style lang="scss" scoped>
.title {
  color: $title;
  white-space: nowrap; //文字不換行
}
.annoucementBrief {
  width: 100%;
  height: 80%;
  overflow-y: auto;
  text-align: center;
  .anouceMentPic {
    // height: 50%;
    width: 80%;
    object-fit: contain;
  }
  .anouceMentTitle {
    margin-top: 10px;
    text-align: center;
    color: white;
  }
  .anouceMentTime {
    margin-top: 10px;
    text-align: center;
    color: #796f87;
  }
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  transform: scale(0.5);
}
// ul {
//   overflow: scroll;
//   overflow-x: hidden; //隱藏橫向滾動軸
//   height: 80%;
//   // margin: 10% 0;
//   // padding: 5% 0;
//   .item {
//     padding: 3px;
//     color: black;
//     width: 100%;
//     margin-bottom: 20px;
//     img {
//       //讓圖片置中縮放
//       max-height: 100%;
//       max-width: 100%;
//       position: relative;
//       object-fit: contain;
//     }
//     title {
//       //文字靠左
//       word-break: break-word;
//       display: flex;
//       justify-content: flex-start;
//       color: black;
//       font-weight: bolder;
//       font-size: 1.2rem;
//     }
//     time {
//       //文字靠左
//       display: flex;
//       justify-content: flex-start;
//       color: gray;
//       font-size: 0.8rem;
//       //字間距
//       letter-spacing: 0.5px;
//     }
//   }
// }
.bottom {
  display: flex;
  // justify-content: space-around;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  background-color: $layout-footer-color;
  height: 20%;
  // margin-top: 10%;

  .confirm-button {
    width: 50%;
    height: 30%;
    margin-top: 10px;
    color: white;
    font-weight: bolder;
    background: #6b0185;
    border-radius: 10px;
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
        background: $modal-key;
      }
    }
    label {
      user-select: none;
      // color: #6b0185;
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
//   background-color: #5496d1;
//   border-radius: 10px;
// }
//畫面高度過小，調整ScrollView高度
@media (max-height: 550px) {
  ul {
    height: 60%;
  }
}

//----------------Old Code---------------

// .popup-mask {
//   position: fixed;
//   z-index: 9998;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   .entrywrap {
//     .container {
//       width: 400px;
//       height: 85%;
//       //margin 属性为给定元素设置所有四个（上下左右）方向的外边距属性
//       margin: 0px auto;
//       background-color: white;
//       border-radius: 10px;
//       border: 3px solid rgb(54, 124, 135);
//       position: relative;
//       top: 4%;
//       .title {
//         color: #3d6e99;
//         font-size: 30px;
//         font-weight: bolder;
//         text-align: center;
//         padding: 5%;
//       }
//       .scrollview {
//         overflow: auto;
//         display: flex;
//         flex-direction: column;
//         justify-content: center;
//         height: 70vh; //自適應高度 https://andy6804tw.github.io/2021/04/05/css-div-full-height/
//         margin: 0 1%;
//         .item {
//           padding: 3px;
//           color: black;
//           width: 100%;
//           img {
//             //讓圖片置中縮放
//             max-height: 100%;
//             max-width: 100%;
//             position: relative;
//             object-fit: contain;
//           }
//           title {
//             //文字靠左
//             display: flex;
//             justify-content: flex-start;
//             color: black;
//             font-weight: bolder;
//             font-size: 18px;
//           }
//           time {
//             //文字靠左
//             display: flex;
//             justify-content: flex-start;
//             color: gray;
//             font-size: 13px;
//             //字間距
//             letter-spacing: 2px;
//           }
//         }
//       }
//       .close-button {
//         position: absolute;
//         left: 95%;
//         bottom: 100%;
//         background-color: transparent;
//         img {
//           width: 30px;
//           //object-fit: contain 保持原有尺寸比例。内容被缩放。
//           object-fit: contain;
//         }
//       }
//     }
//     .bottom {
//       display: flex;
//       //justify-content: space-between = 平均分配寬度，第一項和最後一項貼齊邊緣
//       justify-content: space-between;
//       align-items: center;
//       // flex-wrap: nowrap;
//       //上下邊內縮2%(相對於父層)
//       // margin: 2% 2%;
//       padding: 5% 3%;
//       .confirm-button {
//         color: white;
//         font-weight: bolder;
//         background-image: url("@/assets/images/form/confirmBtn.png");
//         background-size: 100% 100%;
//         background-repeat: no-repeat;
//         background-color: transparent;
//         width: 100px;
//         height: 35px;
//         span {
//           font-size: 25px;
//         }
//       }
//       .checkbox {
//         display: flex;
//         align-items: center;
//         object-fit: contain;
//         img {
//           width: 35px;
//           margin-right: 5px;
//         }
//         label {
//           color: #3d6e99;
//           font-weight: bolder;
//           font-size: 20px;
//         }
//       }
//     }
//   }
// }
// //自定義scrollbar 寬度
// ::-webkit-scrollbar {
//   width: 10px;
//   display: block; //打開
// }
// //自定義scrollbar的旋鈕
// ::-webkit-scrollbar-thumb {
//   background-color: #5496d1;
//   border-radius: 10px;
// }
// //自定義scrollbar的軌道
// ::-webkit-scrollbar-track {
//   // background-color: black;
// }
// //畫面過小，調整彈跳視窗寬度
// @media (max-width: 991px) {
//   .popup-mask {
//     .entrywrap {
//       .container {
//         width: 90%;
//       }
//     }
//   }
// }
</style>
