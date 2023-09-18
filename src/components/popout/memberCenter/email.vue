<template>
  <ModalLayout :pageHeight="thisHeight">
    <template #title>
      <p class="titles">{{ $t("email.email") }}</p>
    </template>
    <template #default>
      <!-- 預設樣式， -->
      <ul>
        <li
          v-for="(mail, index) in allMailData"
          :key="mail.id"
          :class="[mail.is_read ? 'isreaded' : 'notread']"
          @click="readMail(index, mail.id, mail.is_read)"
        >
          <div :class="['mail-wrap', mail.is_read ? 'isreaded' : 'notread']">
            <div :class="['mail-item', { openTitle: showContent === index }]">
              <p class="mail-title">{{ $t(mail.title) }}</p>
            </div>
          </div>
          <div :class="['mail-time', mail.is_read ? 'isreaded' : 'notread']">
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
          <div
            :class="['mail-content', mail.is_read ? 'isreaded' : 'notread']"
            :id="mail.id"
            v-show="showContent === index"
          >
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
    getMailNotification(123);
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
:deep(.titles) {
  color: $title;
}
ul {
  width: 100%;
  height: calc(100% - $title-height);
  padding: 10px 10px 0 10px;
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
      border: 2px solid $readed-box-border;
    }
    &.notread {
      border: 2px solid $unread-box-border;
    }
    .mail-wrap {
      width: 100%;
      height: 60px;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.isreaded {
        color: $readed-box-title-text;
      }
      &.notread {
        color: $unread-box-title-text;
      }
    }
    .mail-time {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: $content-text-1;
      background: $readed-box-content1-bg;
      &.isreaded {
        background: $readed-box-content1-bg;
      }
      &.notread {
        background: $unread-box-content1-bg;
      }
      .mail-date {
        margin-left: 10px;
      }
      > div {
        margin-right: 15px;
        &.isreaded {
          color: #808080;
        }
        &.notread {
          color: $unread-box-title-text;
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
      color: $content-text-1;

      &.isreaded {
        background: $readed-box-content1-bg;
      }
      &.notread {
        background: $unread-box-content1-bg;
      }
    }
  }
}
.pagination {
  width: 100%;
  height: $title-height;
  background: $popoutBottom-color;
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
    background: $canclick-pageBtn-bg;
  }
  .next-button {
    background: $canclick-pageBtn-bg;
  }
  .disableClick {
    background: $button-disabled-bg;
  }
  .pageNum {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $primary;
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
