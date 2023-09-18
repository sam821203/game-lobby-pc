<template>
  <div
    v-if="withdrawalPage_checkTradePwdStatus"
    class="authWrap"
    style="width: 500px"
  >
    <!-- 標題 -->
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("stored.withdrawDetail") }}
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="main">
      <div class="content">
        <div class="item">
          <div class="subtitle">{{ $t("stored.amount") }}</div>
          <!-- <div class="detail" v-price="withdrawAm * 10000"></div> -->
          <div class="detail">{{ withdrawAm }}</div>
        </div>

        <div class="item">
          <div class="subtitle">{{ $t("PIX Type") }}</div>
          <div class="detail">{{ pixType }}</div>
        </div>

        <div class="item">
          <div class="subtitle">{{ $t("PIX Key") }}</div>
          <!-- <div class="detail" v-price="withdrawAm * 10000"></div> -->
          <div class="detail">{{ pixKey }}</div>
        </div>

        <div class="item">
          <div class="subtitle">{{ $t("錢包餘額") }}</div>
          <div
            class="detail"
            v-price="
              Number(balanceData[walletType]?.balance) -
              Number(withdrawAm) * 10000
            "
          ></div>
        </div>
      </div>
      <div class="hr"></div>
      <!-- 0901 -->
      <div class="trade-code"></div>

      <div class="login-wrap">
        <div class="input-wrap">
          <BaseInput
            :label="$t('register.tradePwd')"
            :placeholder="$t('stored.tradePwd')"
            class="input"
            :required="true"
            v-model="pwd"
            @keyup.enter="throttleSave"
          />
        </div>
      </div>
      <div class="errorTxt">{{ $t(withdrawFormErrorText) }}</div>
      <button
        :class="['confirm', { disabled: !pwd }]"
        @click="throttleSave"
        :disabled="!pwd"
      >
        {{ $t("OK") }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount, watch } from "vue";
import BaseInput from "@/components/form/baseInput.vue";
// import { useRouter } from "vue-router";
// import { useMessage } from "@/store/msgStore";
import { useStore } from "@/store/index";
import throttle from "@/utils/throttle";
import { chargeApi } from "@/api/deposit";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import { usepopoutNotice } from "@/store/popoutNotice";
const {
  statusType,
  statusStr,
  positionTop,
  borderType,
  countDownWidth,
  inSlidediv,
} = storeToRefs(usepopoutNotice());
import { useother } from "@/store/other";
const { withdrawFormErrorText } = storeToRefs(useother());
import i18n from "@/utils/i18n";
import {
  getWithdrawWay,
  getWithdrawAm,
  getPixType,
  getPixKey,
  getBankId,
  getBankRoute,
  removeBankNum,
  removeBankName,
  removeWithdrawAm,
  removeWithdrawWay,
  removeBankId,
  removeTaxId,
  removePhoneNum,
  removePixType,
  removePixKey,
} from "@/utils/cookie";
import { useLoading } from "@/store/loadingStore";

const loadingStore = useLoading();
//
import { usectrlLogin } from "@/store/ctrlLogin";
const { withdrawalPage_checkTradePwdStatus } = storeToRefs(usectrlLogin());
//
const { useAuth, useSsevent } = useStore();
const authStore = useAuth();
const { getUserInfo } = authStore;
const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);

const { walletType } = storeToRefs(authStore);
const { t } = i18n.global;
const depositStore = useDeposit();
// const msg = useMessage();
// const router = useRouter();
// const { openMsg } = msg;
//
const withdrawWay = ref();
const withdrawAm = ref();
const pixType = ref();
const pixKey = ref();
const pwd = ref(null);

watch(withdrawalPage_checkTradePwdStatus, (v) => {
  if (v) {
    withdrawWay.value = getWithdrawWay("withdraw_way");
    withdrawAm.value = getWithdrawAm("withdraw_am");
    pixType.value = getPixType("PixType");
    pixKey.value = getPixKey("PixKey");
    pwd.value = "";
  }
});
const handleWithdraw = async (e) => {
  if (e.key === "Enter") {
    return;
  }
  getUserInfo();
  loadingStore.$patch({
    loadingStatus: true,
  });
  const res = await chargeApi(
    getBankId("bank_id"),
    getBankRoute("bank_route"),
    {
      tx_amount: Number(withdrawAm.value),
      phone: "",
      taxid: "",
      pixkey: pixKey.value,
      pixtype: pixType.value,
      second_password: pwd.value,
    }
  );
  if (res.data.code === 0) {
    loadingStore.$patch({
      loadingStatus: false,
    });
    depositStore.$patch({
      gCashNum: null,
      gCashName: null,
    });
    removeBankNum();
    removeBankName();
    removeWithdrawAm();
    removeWithdrawWay();
    removeBankId();
    removeTaxId();
    removePhoneNum();
    removePixType();
    removePixKey();
  }

  // router.push("/operation/tradeRecord");

  // 跳出提示，提示完成提款
  statusType.value = 2;
  statusStr.value = t("已提出提款請求，等待資金發放批准。");
  positionTop.value = "10px";
  borderType.value = 2;
  countDownWidth.value = 100;
  inSlidediv.value = false;
  //
  withdrawalPage_checkTradePwdStatus.value = false;
};

onBeforeUnmount(() => {
  removeBankNum();
  removeBankName();
  removeWithdrawAm();
  removeWithdrawWay();
  removeBankId();
  removeTaxId();
  removePhoneNum();
  removePixType();
  removePixKey();
});

const throttleSave = throttle(handleWithdraw, 3000, true);
const closeModal = () => {
  withdrawalPage_checkTradePwdStatus.value = false;
};
</script>

<style lang="scss" scoped>
.main {
  // height: 100%;
  position: relative;
  color: $primary;
  padding-bottom: 10%;
  .content {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0 20px;
      .subtitle {
        // color: rgb(50, 112, 164);
      }
      .detail {
        white-space: nowrap; /* 防止数字换行 */
        overflow: hidden; /* 隐藏溢出内容 */
        text-overflow: ellipsis; /* 显示省略号 */
        max-width: 160px; /* 或者你可以设置一个固定的最大宽度 */
      }
    }
  }
  .hr {
    // margin-top: 5%;
    width: 90%;
    border: 1px dashed $hr-primary;
    margin: 10px auto;
  }
  button {
    &.confirm {
      width: 80%;
      height: 2.5rem;
      background: $canclick-pageBtn-bg;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border-radius: $border-radius-md;
      margin-top: 10px;
      color: #fff;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.disabled {
      // filter: grayscale(0.7);
      background: $button-disabled-bg;
    }
  }
  .errorTxt {
    text-align: right;
    font-size: 1rem;
    color: $error-color;
  }
}
</style>
