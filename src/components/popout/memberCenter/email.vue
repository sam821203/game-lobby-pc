<template>
  <ModalLayout :pageHeight="thisHeight">
    <template #title>
      <p class="title">{{ $t("email.email") }}</p>
    </template>
    <template #default>
      <!-- <div class="deleteGroup">
        <img
          src="@/assets/images/modal/remind_box.png"
          alt=""
          @click="isSelectAll"
          v-show="selectAll === false"
          class="checkbox"
        />
        <img
          src="@/assets/images/modal/remind_tick.png"
          alt=""
          @click="cancelSelectAll"
          v-show="selectAll === true"
          class="checkbox"
        />
        <span>全選</span>
        <img
          src="@/assets/images/modal/trash_can.png"
          alt=""
          :class="['trashCan', { trashCanDisable: !selectList.length }]"
          @click="deleteMails(selectList)"
        />
      </div> -->
      <ul>
        <li
          v-for="(mail, index) in allMailData"
          :key="mail.id"
          :class="[mail.is_read ? 'isreaded' : 'notread']"
        >
          <div class="mail-wrap">
            <div :class="['mail-item', { openTitle: showContent === index }]">
              <p class="mail-title">{{ $t(mail.title) }}</p>
            </div>
          </div>
          <div
            class="mail-time"
            @click="readMail(index, mail.id, mail.is_read)"
          >
            <p v-time="mail.send_at" class="mail-date"></p>
            <div
              :class="[
                showContent == index ? 'rotate90' : '',
                mail.is_read ? 'isreaded' : 'notread',
              ]"
            >
              >
            </div>
          </div>
          <div class="content" :id="mail.id" v-show="showContent === index">
            <!-- <p class="mail-content">
              {{ $t(mail.content) }}
            </p> -->
            <div v-html="mail.content" class="mail-content"></div>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <div
          @click="previousPage"
          :class="[Number(currentPage) == 1 ? 'disableClick' : 'pre-button']"
        >
          <span>{{ $t("email.pre") }}</span>
        </div>
        <div class="pageNum">
          <p class="current-page">
            <!-- {{ totalPage === currentPage ? totalPage : currentPage }} -->
            {{ currentPage }}
          </p>
          <p class="divider">/</p>
          <p class="total-page">{{ totalPage }}</p>
        </div>

        <div
          @click="nextPage"
          :class="[
            Number(totalPage) === Number(currentPage)
              ? 'disableClick'
              : 'next-button',
          ]"
        >
          <span>{{ $t("email.next") }}</span>
        </div>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from "@/components/modal/layout";
import { ref } from "vue";
import { mailApi, readMailApi } from "@/api/mail";
// import moment from "moment";
// import { useMessage } from "@/store/msgStore";
import { useMail } from "@/store/mailStore";
const mailStore = useMail();
const { getMailNotification } = mailStore;
// const msg = useMessage();
// const { openMsg } = msg;
const showContent = ref(-1);
const allMailData = ref();
const currentPage = ref("1");
const totalPage = ref("");
const currentIdList = ref([]);
const selectList = ref([]);
const selectAll = ref(false);

const thisHeight = "700px";
// 取得當前頁面所有信件
const getAllMail = async () => {
  const { data } = await mailApi(currentPage.value, 5);
  if (data.data.total_page >= 1) {
    totalPage.value = data.data.total_page;
  } else {
    totalPage.value = 1;
  }

  if (data.code === 0) {
    allMailData.value = data.data.mails;
    currentIdList.value = allMailData.value?.map((mail) => mail.id);

    // allMailData.value = data.data.mails
    // currentIdList.value = allMailData.value.map((mail) => mail.id)
  }
};
getAllMail();

// 信件已讀
const readList = ref([]);
const readMail = async (index, id) => {
  if (showContent.value === index) {
    showContent.value = -1;
  } else {
    showContent.value = index;
    readList.value.push(id);
    await readMailApi({ id: readList.value });
    allMailData.value[index].is_read = true;
    getMailNotification();
  }
};

// // 勾選信件
// const selectMail = (index, id) => {
//   selectList.value.push(id);
// };

// // 取消勾選
// const cancelSelectMail = (index, id) => {
//   selectAll.value = false;
//   selectList.value.splice(selectList.value.indexOf(id), 1);
// };

// // // 全選
// const isSelectAll = () => {
//   selectAll.value = true;
//   selectList.value = [...currentIdList.value];
// };

// // 取消全選
// const cancelSelectAll = () => {
//   selectAll.value = false;
//   selectList.value = [];
// };

// 切換分頁
const nextPage = () => {
  if (currentPage.value < totalPage.value) {
    currentPage.value++;
    selectList.value = [];
    getAllMail();
    selectAll.value = false;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectList.value = [];
    getAllMail();
    selectAll.value = false;
  }
};

// // 刪除信件
// const deleteMails = (mailId) => {
//   if (selectList.value.length) {
//     openMsg({
//       content: "openMsg.deleteConfirm",
//       hasBtn: true,
//       hasCancel: true,
//     }).then(async () => {
//       const { data } = await deleteMailApi(JSON.stringify({ id: mailId }));
//       if (data.code === 0) {
//         await getAllMail();
//         await getMailNotification();
//         selectList.value = [];
//         selectAll.value = false;
//         showContent.value = -1;
//         if (
//           currentPage.value >= totalPage.value &&
//           currentPage.value > 1 &&
//           !currentIdList.value
//         ) {
//           currentPage.value--;
//           getAllMail();
//         }
//       }
//     });
//   }
//   getAllMail();
// };

// const formatTime = (data) => {
//   return moment(data).tz("Asia/Taipei").format("YYYY/MM/DD HH:mm:ss");
// };
</script>

<style lang="scss" scoped>
.title {
  color: $title;
}
ul {
  width: 100%;
  height: calc(100% - $title-height);
  padding: 10px 10px 0 10px;
  // margin: 10px 0;
  overflow-y: auto;
  color: $primary;
  li {
    width: 100%;
    min-height: 100px;
    // padding-left: 1rem;
    border-radius: 15px;
    margin-bottom: 10px;
    box-sizing: border-box;
    overflow: hidden;
    &.isreaded {
      border: 2px solid #85639b;
    }
    &.notread {
      border: 2px solid #383838;
    }
    .mail-wrap {
      width: 100%;
      height: 60px;
      padding: 10px;
      box-sizing: border-box;
      color: $primary;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $darkpageTop-color;
      // .icon-wrap {
      //   width: 30%;
      //   display: flex;
      //   justify-content: flex-end;
      //   align-items: center;
      //   .bell {
      //     width: 50%;
      //     margin-right: 5%;
      //     &::before {
      //       content: "NEW";
      //       position: absolute;
      //       z-index: -1;
      //       -webkit-text-stroke: 3px red;
      //     }
      //   }
      //   .opened {
      //     width: 25%;
      //     height: 25%;
      //   }
      //   .notOpen {
      //     width: 25%;
      //     height: 25%;
      //     transform: rotate(-90deg);
      //   }
      // }

      // .mail-item {
      //   // color: $title;

      //   .mail-title {
      //     // color: rgb(41, 73, 87);
      //     margin: 2% 0;
      //     padding-bottom: 2%;
      //     font-size: 1.1rem;
      //     flex: 1;
      //   }
      //   .mail-date {
      //     color: #b0b0b0;
      //     font-size: 0.9rem;
      //   }
      // }
      // .openTitle {
      //   color: $title;
      // }
    }
    .mail-time {
      width: 100%;
      height: 40px;
      background: $darkpageMiddle-color;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: $popotContent-color;
      .mail-date {
        margin-left: 10px;
      }
      > div {
        margin-right: 15px;
        &.isreaded {
          color: #808080;
        }
        &.notread {
          color: #a903d2;
        }
      }
      .rotate90 {
        transform: rotate(90deg);
      }
    }
    .mail-content {
      padding: 10px 15px 10px 10px;
      font-size: 1rem;
      margin: 0 auto;
      line-height: 1.2rem;
      background: $darkpageBottom-color;
      color: $popotContent-color;
    }
  }
}
.pagination {
  width: 100%;
  height: $title-height;
  background: $layout-footer-color;
  display: flex;
  justify-content: center;
  align-items: center;

  .pre-button,
  .disableClick,
  .next-button {
    min-width: 120px;
    margin: 0 10px;
    height: 70%;
    // line-height: 90%;
    border-radius: 15px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  .pre-button {
    background: $canclick-pageBtn-color;
  }
  .next-button {
    background: $canclick-pageBtn-color;
  }
  .disableClick {
    background: $disableClick-page-color;
  }
  .pageNum {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-primary;
    .current-page {
      margin-right: 5px;
    }
    .total-page {
      color: #6e667c;
      margin-left: 5px;
    }
  }
}
</style>
