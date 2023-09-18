<template>
  <div class="withdraw-wrapper">
    <div class="wallet-info">
      <div class="item">
        <p class="title">{{ $t("stored.validBets") }}</p>
        <p class="content" v-price="wallet[0].flow"></p>
      </div>
      <div class="item">
        <p class="title">{{ $t("stored.threshold") }}</p>
        <p class="content" v-price="wallet[0].cash_out_gateway"></p>
      </div>
      <div class="item">
        <p class="title">{{ $t("stored.balance") }}</p>
        <div class="coin-wrap">
          <img src="@/assets/images/COIN1.png" alt="" class="coin" />
          <p class="content" v-price="balanceData[walletType]?.balance"></p>
        </div>
      </div>
    </div>
    <!-- 提款方式 -->
    <div class="withdraw-way">
      <div class="content">
        <button
          v-for="(bank, index) in bankList"
          :key="bank.bank_id"
          :class="[
            'item',
            { selected: selected === index },
            { maintain: bank.maintain },
          ]"
          @click="selectWay(bank.bank_id, bank.route[0], index)"
          :disabled="bank.maintain"
          v-show="index == 0"
        >
          <p v-if="bank.maintain" class="maintainWords">
            <span>Em </span>
            <span>Manutenção</span>
          </p>
          <img :src="bank.icon" alt="" class="icon" />
          <p class="name">{{ bank.bank_display_name }}</p>
        </button>
      </div>
    </div>
    <!-- 提款金額 -->

    <div class="withdraw-amount">
      <div class="label">{{ $t("金額") }}</div>
      <div class="default">
        <!-- :placeholder="$t('stored.withdrawAmount')" -->

        <input
          type="number"
          class="amount"
          v-model="withdrawAmount"
          @keyup.enter="throttleSave"
          @keyup="handleInput"
          inputmode="numeric"
          min="0"
        />
        <img
          v-if="Number.isInteger(withdrawAmount) || withdrawAmount >= 100"
          class="clear"
          @click="clear"
          src="@/assets/images/memberCenter/cancel.png"
          alt=""
        />
        <i class="bi"> R$ </i>
        <!-- <i class="bi bi-keyboard-fill" v-else></i> -->
      </div>

      <div class="options">
        <div
          class="option"
          v-for="(option, index) in optionList"
          :key="index"
          @click="addAmount(option.amount, option.label)"
        >
          {{ option.label }}
        </div>
      </div>
      <div class="notice">
        Lembrete amigável! Por favor, feche o seu jogo antes de processar o
        Depósito ou Sacar. Obrigado!
      </div>
    </div>
    <div class="hr"></div>
    <div class="addPix">
      <div class="label">
        {{ $t("請選擇PIX") }}
      </div>
      <div class="pixList">
        <div class="pixItem empty" @click="goAdd_PIXPAGE">
          <div class="plusPIXIcon">+</div>
        </div>

        <div
          v-for="(item, index) in pixList"
          :key="index"
          @click="
            handleGCashSelect(
              item.taxid,
              item.phone,
              item.pixtype,
              item.pixkey,
              index
            )
          "
          :class="[
            'pixItem',
            'notempty',
            {
              choosed: choosedPixNum == index,
            },
          ]"
        >
          <div class="pixType">{{ item.pixtype }}</div>
          <div class="pixKey" v-slicePixKey:[16]="item.pixkey"></div>
        </div>
      </div>
    </div>
    <button
      :class="[
        'confirm',
        {
          disabled:
            !withdrawAmount ||
            withdrawAmount < 20 ||
            withdrawTime === 0 ||
            pixKey === '' ||
            !pixKey ||
            pixKey === undefined ||
            pixKey === null,
        },
      ]"
      @click.prevent="throttleSave"
      :disabled="
        !withdrawAmount ||
        withdrawAmount < 20 ||
        withdrawTime === 0 ||
        pixKey === '' ||
        !pixKey ||
        pixKey === undefined ||
        pixKey === null
      "
    >
      {{ $t("stored.OK") }}
      <!-- {{ pixKey }} -->
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useMessage } from "@/store/msgStore";
import { useStore } from "@/store/index";
import { getBankApi, getGCashApi } from "@/api/deposit";
import throttle from "@/utils/throttle";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import {
  setWithdrawWay,
  setWithdrawAm,
  setTaxId,
  setPhoneNum,
  setPixType,
  setPixKey,
  setBankId,
  setBankRoute,
  removeBankNum,
  removeBankName,
  removeTaxId,
  removePhoneNum,
  removePixType,
  removePixKey,
  // setWithdrawType,
} from "@/utils/cookie";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
//
import { usectrlLogin } from "@/store/ctrlLogin";
const {
  addpixPageStatus, //新增PIX頁面
  withdrawalPageStatus, // 提款頁面
  withdrawalPage_checkTradePwdStatus,
} = storeToRefs(usectrlLogin());

withdrawalPage_checkTradePwdStatus;
const optionList = ref([
  { label: "20", amount: 20 },
  { label: "50", amount: 50 },
  { label: "100", amount: 100 },
  { label: "200", amount: 200 },
  { label: "500", amount: 500 },
  { label: "1,000", amount: 1000 },
  { label: "2,000", amount: 2000 },
  { label: "5,000", amount: 5000 },
]);
const depositStore = useDeposit();
const { taxId, phone, type, pixKey } = storeToRefs(depositStore);
const { useAuth, useSsevent } = useStore();

const authStore = useAuth();
const { getUserInfo } = authStore;
getUserInfo();
const { userInfo, walletType } = storeToRefs(authStore);
// const maxAm = ref(userInfo.value.tixian_max_amount);
const maxAm = ref(20000);
const withdrawTime = ref(
  userInfo.value.tixian_max_times - userInfo.value.tixian_times
);

// 判斷玩家是否為體驗帳號以帶入錢包
const wallet = ref(
  Object.values(userInfo.value.wallets).filter(
    (item) => item.currency === walletType.value
  )
);

const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);
const flow = ref(wallet.value[0].flow);
const gateway = ref(wallet.value[0].cash_out_gateway);
const msg = useMessage();
const { openMsg } = msg;
const withdrawWay = ref("PIX");
const withdrawAmount = ref(null);
const bankList = ref([]);
const selected = ref(0);

const getBank = async () => {
  const data = await getBankApi();
  bankList.value = data.data.data.banks.filter(
    (bank) => bank.open === true && bank.type === "tixian"
  );
  setBankRoute(bankList.value[0].route[0]);
  setBankId(bankList.value[0].bank_id);

  if (bankList.value[0].maintain === true) {
    selected.value = 1;
    setBankId(bankList.value[1].bank_id);
    setBankRoute(bankList.value[1].route[0]);
  }
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
  }
};

const selectWay = (id, route, index) => {
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
  } else {
    setBankId(id);
    setBankRoute(route);
    selected.value = index;
  }
};
const addAmount = (amount, label) => {
  if (bankList.value[0].maintain === true) {
    return;
  }
  if (withdrawAmount.value === "") {
    withdrawAmount.value = Number(0);
  }
  let balance = balanceData.value[walletType.value].balance / 10000;
  if (label === "max") {
    if (balance < maxAm.value) {
      withdrawAmount.value = Math.floor(balance);
    } else {
      withdrawAmount.value = maxAm.value;
    }
  }

  if (withdrawAmount.value + amount > balance) {
    withdrawAmount.value = Math.floor(balance);
  } else {
    if (withdrawAmount.value + amount < maxAm.value) {
      withdrawAmount.value += amount;
    } else {
      withdrawAmount.value = maxAm.value;
    }
  }
};

const handleInput = (e) => {
  if (e.key === "Backspace") {
    return;
  }
  if (e.key === "Enter") {
    return;
  }
  let balance = balanceData.value[walletType.value].balance / 10000;
  if (withdrawAmount.value <= maxAm.value) {
    if (withdrawAmount.value > balance) {
      withdrawAmount.value = Math.floor(balance);
    } else {
      withdrawAmount.value = Number(
        withdrawAmount.value.toString().replace(/[^0-9]/g, "")
      );
    }
  } else {
    withdrawAmount.value = maxAm.value;
  }
  if (withdrawAmount.value === 0) {
    withdrawAmount.value = null;
  }
};

const clear = () => {
  withdrawAmount.value = null;
};

const handleWithdraw = async (e) => {
  if (e.key === "Enter") {
    return;
  }
  if (flow.value < gateway.value) {
    openMsg({
      content: t("有效投注不足"),
    })
      .then(() => {
        withdrawWay.value = "";
        selected.value = -1;
        withdrawAmount.value = null;
        removeBankNum();
        removeBankName();
        removeTaxId();
        removePhoneNum();
        removePixType();
        removePixKey();
        depositStore.$patch({
          taxId: null,
          phone: null,
          type: null,
          pixKey: null,
          orderNum: null,
        });
      })
      .catch(() => {
        withdrawWay.value = "";
        selected.value = -1;
        withdrawAmount.value = null;
        removeBankNum();
        removeBankName();
        removeTaxId();
        removePhoneNum();
        removePixType();
        removePixKey();
        depositStore.$patch({
          taxId: null,
          phone: null,
          type: null,
          pixKey: null,
          orderNum: null,
        });
      });
  } else {
    setWithdrawWay(withdrawWay.value);
    setWithdrawAm(withdrawAmount.value);
    setTaxId(taxId.value);
    setPhoneNum(phone.value);
    setPixType(type.value);
    setPixKey(pixKey.value);
    withdrawalPageStatus.value = false;
    withdrawalPage_checkTradePwdStatus.value = true;
    // nextTick(() => {
    //   withdrawalPage_checkTradePwdStatus.value = true;
    // });
  }
};
const throttleSave = throttle(handleWithdraw, 3000, true);

const goAdd_PIXPAGE = () => {
  withdrawalPageStatus.value = false;
  nextTick(() => {
    addpixPageStatus.value = true;
  });
};
//
//
// 選擇pix的部分
const pixList = ref([]);
const getGCash = async () => {
  try {
    const res = await getGCashApi();
    if (res.data.code === 0) {
      pixList.value = res.data.data?.bank_account?.brapay_addresses;
    }
  } catch (error) {
    console.log(error);
  }
};
// 判斷是選擇哪個PIX
const choosedPixNum = ref(0);
const handleGCashSelect = (taxid, phone, pixtype, pixkey, index) => {
  depositStore.$patch({
    taxId: taxid,
    phone: phone,
    type: pixtype,
    pixKey: pixkey,
  });
  choosedPixNum.value = index;
};
//
watch(pixList, (v) => {
  if (v.length > 0) {
    handleGCashSelect(v[0].taxid, v[0].phone, v[0].pixtype, v[0].pixkey, 0);
  }
});

onMounted(() => {
  getGCash();
  getBank();
  if (phone.value !== null) {
    selected.value = 0;
    setBankId(10);
  }
});

onBeforeUnmount(() => {
  depositStore.$patch({
    taxId: null,
    phone: null,
    type: null,
    pixKey: null,
    orderNum: null,
  });
});
</script>

<style lang="scss" scoped>
.withdraw-wrapper {
  color: $primary;
  .wallet-info {
    display: flex;
    justify-content: space-evenly;
    height: 4rem;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-left: 2%;
    white-space: break-spaces;
    .item {
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      flex: 1;
      .coin-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        .coin {
          width: 20%;
        }
      }
    }
  }
  .withdraw-way {
    .content {
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      width: 60%;
      .item {
        text-align: center;
        background: none;
        padding: 2%;
        border-radius: $border-radius-md;
        border: 5px solid transparent;
        .icon {
          width: 70px;
          height: 70px;
        }
        .name {
          text-align: center;
          margin-top: 5%;
          color: #fff;
        }
      }
      .selected {
        border: 5px solid #f7e4ff;
      }
      .maintain {
        background: $disable-btn-color;
        border-radius: $border-radius-md;
        position: relative;
        img {
          filter: brightness(0.5);
        }
      }
      .maintainWords {
        position: absolute;
        top: 30%;
        font-weight: 600;
        color: #fff;
        font-size: 0.8rem;
        right: 0;
        filter: drop-shadow(2px 4px 6px black);
        z-index: 999;
        span {
          display: inline-block;
        }
      }
    }
  }
  .withdraw-type {
    width: 90%;
    margin: 0 auto;
    margin-top: 5%;
    .expand-default {
      width: 100%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      position: relative;
      color: rgb(49, 79, 118);
      .expandListOpen {
        position: absolute;
        right: 1%;
        top: 35%;
        width: 6%;
        transform: rotate(180deg);
      }
    }
    .typeSelectedColor {
      color: $primary;
    }
    .default {
      width: 100%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid rgb(54, 100, 131);
      border-radius: 5px;

      .list-open {
        position: absolute;
        right: 1%;
        top: 35%;
        width: 6%;
      }
    }
    .options {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 1%;
      .option {
        height: 2rem;
        line-height: 2rem;
      }
    }
  }
  .expand {
    border: 2px solid rgb(54, 100, 131);
    border-radius: 5px;
  }
  .withdraw-amount {
    margin-top: 10px;
    .label {
      width: 90%;
      font-weight: bold;
      font-size: 1rem;
      margin: 0 auto 5px auto;
    }
    .default {
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid $withdraw-deposit-input-border;
      border-radius: 5px;
      position: relative;
      background: $default-input-bg;
      input {
        background: none;
      }
      .amount {
        font-weight: bold;
        width: 75%;
        text-align: right;
        outline: none;
        color: white;
        &::-webkit-input-placeholder {
          text-align: center;
          color: #f7e4ff;
        }
      }
      .clear {
        width: 20px;
        position: absolute;
        right: 5%;
        top: 25%;
        font-weight: 600;
        filter: contrast(0);
        opacity: 0.6;
      }
      i {
        font-size: 1.5rem;
        position: absolute;
        left: 5px;
        top: -6%;
        font-weight: 600;
        color: $withdraw-deposit-input-border;
      }
    }
    .options {
      width: 95%;
      margin: 0 auto;
      margin-top: 10px;
      .option {
        display: inline-block;
        width: calc(30%);
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;

        border-radius: 5px;
        background: $canclick-pageBtn-bg;
        margin: 1%;
        color: #fff;
        font-weight: 600;
      }
    }
  }
  .withdraw-address {
    margin-top: 5%;
    .default {
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.5rem;
      border: 2px solid $withdraw-deposit-input-border;
      border-radius: 5px;
      position: relative;
      input {
        background: none;
      }
      .amount {
        font-weight: bold;
        width: 75%;
        text-align: right;
        outline: none;
        color: white;
        &::-webkit-input-placeholder {
          text-align: center;
          color: #f7e4ff;
        }
      }
      .clear {
        width: 20px;
        position: absolute;
        right: 5%;
        top: 25%;
        font-weight: 600;
        filter: contrast(0);
        opacity: 0.6;
      }
      i {
        font-size: 1.5rem;
        position: absolute;
        left: 5px;
        top: -6%;
        font-weight: 600;
        color: $withdraw-deposit-input-border;
      }
    }
  }
  .remind {
    text-align: center;
    margin: 10% 0 5%;
  }
  .confirm {
    width: 90%;
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
  .disabled {
    // filter: grayscale(0.7);
    // color: gray;
    background: $button-disabled-bg;
  }
  .hr {
    // margin-top: 5%;
    width: 90%;
    border: 1px dashed $hr-primary;
    margin: 10px auto;
  }
  .addPix {
    > .label {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 1rem;
    }
    .pixList {
      max-height: 120px;
      overflow-y: auto;
      padding-right: 5px;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-track {
        background: $hr-primary;
      }
      &::-webkit-scrollbar-thumb {
        background: $scrollbar-track-bg;
        // border-radius: 20px;
      }
      &::-webkit-scrollbar-button {
        // background: transparent;
      }
      .pixItem {
        width: 100%;
        height: 2.5rem;
        margin-bottom: 10px;
        border-radius: 5px;
        user-select: none;
        &.notempty {
          color: $withdraw-deposit-input-border;
          border: 1px solid $withdraw-deposit-input-border;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          &.choosed {
            color: $choosed-Content-Border;
            border: 1px solid $choosed-Content-Border;
          }
          &.pixType,
          &.pixKey {
            font-size: 1.5rem;
          }
        }
        &.empty {
          color: $primary;
          border: 1px dashed $primary;
          display: flex;
          justify-content: center;
          align-items: center;
          .plusPIXIcon {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 2.5px solid $primary;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 25px;
          }
        }
      }
    }
  }
}
.notice {
  padding: 1rem 2.5rem 0 2.5rem;
  text-align: center;
  color: green;
}
</style>
