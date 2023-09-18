<template>
  <div
    class="authWrap"
    style="width: 500px; margin-top: 1rem"
    v-show="depositPageStatus || withdrawalPageStatus"
  >
    <!--  -->
    <div class="navbar">
      <div class="logo" @click="closeModal">
        <img
          :src="require(`@/assets/images/i18n/${curLang.name}/logo.png`)"
          alt=""
        />
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="main">
      <ul class="link-wrap">
        <li
          :class="['link-item', depositPageStatus ? 'selected' : 'notSelected']"
          @click="changeRoute('存款')"
        >
          <p>{{ $t("存款") }}</p>
        </li>
        <li
          :class="[
            'link-item',
            withdrawalPageStatus ? 'selected' : 'notSelected',
          ]"
          @click="changeRoute('提款')"
        >
          <p style="font-size: 1rem; width: 100%">
            {{ $t("提款") }}
          </p>
        </li>
      </ul>
      <deposit v-if="depositPageStatus" />
      <withdraw v-if="withdrawalPageStatus" />
    </div>
  </div>
</template>

<script setup>
// import { ref, onMounted } from "vue";
// import { getUuid } from "@/utils/cookie";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import deposit from "@/views/deposit/deposit.vue";
import withdraw from "@/views/deposit/withdraw.vue";
//
import { usectrlLogin } from "@/store/ctrlLogin";
const { depositPageStatus, withdrawalPageStatus, userInfosetting } =
  storeToRefs(usectrlLogin());
//
import i18n from "@/utils/i18n";
const { t } = i18n.global;

const { useLanguage, useAuth, useMessage } = useStore();
const authStore = useAuth();
const { getUserInfo } = authStore;
const { userInfo } = storeToRefs(authStore);
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);

const msg = useMessage();
const { openMsg } = msg;

// const conditionVerify = (func) => {
//   if (userInfo.value.real_name && userInfo.value.is_deposit) {
//     withdrawalPageStatus.value = true;
//   }
//   if (!userInfo.value.real_name) {
//     //有無寫姓名
//     openMsg({
//       content: t("請先填寫您的真實姓名"),
//     }).then(() => {
//       // router.push("/info/userInfo");
//       userInfosetting.value = true;
//     });
//     return;
//   }
//   if (!userInfo.value.is_deposit) {
//     //有無存款過
//     openMsg({
//       content: t("請先進行存款"),
//     }).then(() => {
//       depositPageStatus.value = true;
//     });
//     return;
//   }
//   func;
// };

const changeRoute = async (v) => {
  depositPageStatus.value = false;
  withdrawalPageStatus.value = false;
  if (v === "存款") {
    depositPageStatus.value = true;
    withdrawalPageStatus.value = false;
  } else {
    await getUserInfo();
    if (!userInfo.value.real_name) {
      //有無寫姓名
      openMsg({
        content: t("請先填寫您的真實姓名"),
      }).then(() => {
        // router.push("/info/userInfo");
        userInfosetting.value = true;
      });
      return;
    } else if (!userInfo.value.is_deposit) {
      //有無存款過
      openMsg({
        content: t("請先進行存款"),
      }).then(() => {
        depositPageStatus.value = true;
      });
      return;
    } else if (!userInfo.value.is_set_second_password) {
      //有無存款過
      openMsg({
        content: t("請先設定交易密碼"),
      }).then(() => {
        userInfosetting.value = true;
      });
      return;
    } else {
      depositPageStatus.value = false;
      withdrawalPageStatus.value = true;
    }
  }
};

// const openWebsite = (url) => {
//   window.open(url);
// };
const closeModal = () => {
  depositPageStatus.value = false;
  withdrawalPageStatus.value = false;
};
// onMounted(() => {
//   if (route.params.id) {
//     authStatus.value = "register";
//   }
// });
</script>

<style lang="scss" scoped>
.link-list {
  li {
    img {
      width: 45px;
    }
  }
}
:deep(.input) {
  background: $default-input-bg;
  border: 1px solid #646d80;
  // color: #646d80;
  color: white;
}
.footerbtn {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: space-around;
  // align-items: center;
  img {
    height: 100%;
    object-fit: contain;
  }
}
</style>
