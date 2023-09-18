<template>
  <depositPopout v-if="orderInprogress" />
  <div class="deposit-wrapper" v-else>
    <!-- 存款方式 -->
    <div class="deposit-way">
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
        >
          <p v-if="bank.maintain" class="maintainWords">
            <span>Em </span>
            <span>Manutenção</span>
          </p>
          <img
            :src="bank.icon"
            alt=""
            :class="['icon', { maintainIcon: bank.maintain }]"
          />
          <p class="name">{{ bank.bank_display_name }}</p>
        </button>
      </div>
    </div>
    <!-- 存款金額 -->
    <div class="deposit-amount">
      <div class="label">{{ $t("金額") }}</div>
      <div class="default">
        <input
          type="number"
          class="amount"
          v-model="depositAmount"
          @keyup.enter="throttleSave"
          @keyup="handleInput"
          inputmode="numeric"
          min="0"
        />
        <!-- :placeholder="$t('stored.depositPlaceholder')" -->
        <img
          v-if="Number.isInteger(depositAmount) || depositAmount >= 20"
          class="clear"
          @click="clear"
          src="@/assets/images/memberCenter/cancel.png"
          alt=""
        />
        <i class="bi"> R$ </i>
        <!-- <i class="bi bi-keyboard-fill" v-else></i> -->
      </div>
      <div class="options">
        <button
          class="option"
          v-for="(option, index) in optionList"
          :key="index"
          @click="addAmount(option.amount)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    <div class="notice">
      Lembrete amigável! Por favor, feche o seu jogo antes de processar o
      Depósito ou Sacar. Obrigado!
    </div>
    <button
      :class="[
        'confirm',
        {
          disabled: !depositAmount || !depositWay || depositAmount < 20,
        },
      ]"
      @click.prevent="throttleSave"
      :disabled="!depositAmount || !depositWay || depositAmount < 20"
    >
      {{ $t("stored.OK") }}
    </button>
    <div v-if="eventList" class="chooseOption">
      <div
        class="firstDepositCheck container"
        v-for="event in eventList"
        :key="event.id"
      >
        <div
          :class="['checkbox', { checkbox2: checkId === event.id }]"
          @click="selectedId(event.id)"
        >
          <div :class="['check', { checked: checkId === event.id }]" />
        </div>
        <p style="margin-left: 8%">Eu quero participar desta promoção.</p>
        <span :class="{ selectEvent: selected }" style="margin-left: 8%">{{
          event.promotion
        }}</span>
        <div
          class="contentWrap"
          v-for="(item, index) in event.conditions"
          :key="index"
        >
          <p class="eventType">
            <span
              >{{ $t("存款範圍") }}: {{ item.lower / 10000 }} ~
              {{ item.upper / 10000 }}</span
            ><span class="bonus"
              >{{ $t("紅利") }}:
              {{
                event.bonus_type === 0
                  ? item.bonus / 10000
                  : item.bonus / 10000 + "%"
              }}</span
            >
          </p>
          <p>{{ $t("提款流水倍數") }}: {{ item.threshold_multiple }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useMessage } from "@/store/msgStore";
// import { useRouter } from "vue-router";
import {
  getBankApi,
  chargeApi,
  getOrderApi,
  getAllOrderApi,
  getEventApi,
} from "@/api/deposit";
import throttle from "@/utils/throttle";
import { useDeposit } from "@/store/depositStore";
import { useLoading } from "@/store/loadingStore";
// import { useModal } from "@/store/modalStore";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
//
import depositPopout from "@/views/deposit/depositPopout";
//
const { useAuth } = useStore();
const authStore = useAuth();
const { loginData } = storeToRefs(authStore); //userInfo
const { getUserInfo } = authStore;
const depositStore = useDeposit();
const { orderNum } = storeToRefs(depositStore);
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
// const router = useRouter();
const msg = useMessage();
const { openMsg } = msg;
const selected = ref(0);
const depositWay = ref(5);
const depositAmount = ref(null);
const bankList = ref([]);
const loadingStore = useLoading();
// const modalStore = useModal();
// const { toggleModal, modalType } = modalStore;
// const firstDeposit = ref(true);
// const everydayCashBack = ref(false);
const bankId = ref(null);
const depositRoute = ref("brapay_pay");
const eventList = ref(null);
//
const checkId = ref(0);
const selectedId = (id) => {
  if (id !== checkId.value) {
    checkId.value = id;
  } else {
    checkId.value = 0;
  }
};
getUserInfo();

onMounted(() => {
  getAllOrder();
  getUserInfo();
  getBank();
  getEvent();
});
const getEvent = async () => {
  const data = await getEventApi(loginData.value.user_uuid);
  eventList.value = data.data.data.data;
};
//
const orderInprogress = ref(false);
// 驗證有無有效存款單
const isValidOrder = () => {
  if (validOrder.value.length) {
    depositAmount.value = null;
    depositStore.$patch({
      orderNum: validOrder.value[0].merch_order_no,
    });
    orderInprogress.value = true;
  }
};

// 檢查有無有效存款單，若有則顯示彈窗
const validOrder = ref(null);
const getAllOrder = async () => {
  const res = await getAllOrderApi();
  validOrder.value = res.data.data.orders.filter(
    (order) =>
      order.status === 2 &&
      new Date(order.maybe_expired_at).getTime() > new Date().getTime()
  );

  isValidOrder();
};

// 三方清單
const getBank = async () => {
  const data = await getBankApi();
  bankList.value = data.data.data.banks.filter(
    (bank) => bank.open === true && bank.type === "charge"
  );
  bankId.value = bankList.value[0].bank_id;
  if (bankList.value[0].maintain === true) {
    selected.value = 1;
    bankId.value = bankList.value[1].bank_id;
  }
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
  }
};

// 存款方式
const selectWay = (id, route, index) => {
  if (
    bankList.value[0].maintain === true &&
    bankList.value[1].maintain === true
  ) {
    selected.value = -1;
    bankId.value = -1;
    return;
  }
  bankId.value = id;
  selected.value = index;
  depositRoute.value = route;
};

// 儲值金額按鈕
const addAmount = (value) => {
  isValidOrder();

  if (!depositWay.value) {
    openMsg({
      content: "請先選擇存款方式",
    });
    return;
  }
  if (depositAmount.value === "") {
    depositAmount.value = Number(0);
  }
  depositAmount.value += value;
  //  else {
  //   depositAmount.value = 20000;
  // }
};

// 儲值input驗證為正整數
const handleInput = (e) => {
  isValidOrder();
  if (e.key === "Backspace") {
    return;
  }
  if (e.key === "Enter") {
    return;
  }
  depositAmount.value = Number(
    depositAmount.value.toString().replace(/[^0-9]/g, "")
  );
  if (depositAmount.value === 0) {
    depositAmount.value = null;
  }
  if (depositAmount.value > 20000) {
    depositAmount.value = 20000;
  }
};

// 清除input
const clear = () => {
  depositAmount.value = null;
};

// 建立存款單
const handleDeposit = async (e) => {
  if (e.key === "Enter") {
    return;
  }
  isValidOrder();

  loadingStore.$patch({
    loadingStatus: true,
  });
  const res = await chargeApi(bankId.value, depositRoute.value, {
    tx_amount: Number(depositAmount.value),
    campaign_id: checkId.value,
    // is_deposit: userInfo.value.is_deposit,
  });
  // if (res) {
  //   return;
  // }
  if (res.data.code === 0) {
    loadingStore.$patch({ loadingStatus: false });
    depositStore.$patch({
      orderNum: res.data.data.merch_order_no,
    });
    getOrderPath();
  }
};

// 開分頁到 Pix
const chargeUrl = ref("");
const getOrderPath = async () => {
  const res = await getOrderApi(orderNum.value);
  if (res.data.code === 0) {
    chargeUrl.value = res.data.data.order.content.charge_url;
    window.open(chargeUrl.value);
    nextTick(() => {
      // location.reload();
      getAllOrder();
      getUserInfo();
      getBank();
    });
  }
};

// 防止連點
const throttleSave = throttle(handleDeposit, 3000, true);
</script>

<style lang="scss" scoped>
.deposit-wrapper {
  color: $primary;
  .deposit-way {
    .content {
      width: 60%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .item {
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
          // font-size: 0.9rem;
          color: #fff;
        }
      }
      .selected {
        border: 5px solid #f7e4ff;
        // background-image: url("@/assets/images/memberCenter/choose.png");
        // background-size: 100% 100%;
        // background-repeat: no-repeat;
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
  .deposit-type {
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
      color: #fff;
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
      // color: rgb(49, 79, 118);
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
  .deposit-amount {
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
      margin-top: 3%;
      .option {
        display: inline-block;
        width: calc(30%);
        height: 2.7rem;
        line-height: 2.7rem;
        text-align: center;

        border-radius: 5px;
        background: $canclick-pageBtn-bg;
        margin: 1%;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .confirm {
    width: 90%;
    height: 2.5rem;
    background: $confirm-btn-bg;
    margin: 0 auto;
    text-align: center;
    line-height: 2.5rem;
    border-radius: $border-radius-md;
    margin-top: 5%;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .disabled {
    filter: grayscale(0.7);
    color: gray;
  }

  .chooseOption {
    width: 100%;
    padding: 0 12px;
    height: 200px;
    overflow-y: auto;
  }

  .container {
    margin: 4% 2% 1%;
    position: relative;
    input {
      margin-right: 2%;
    }
    .checkbox {
      /* 主外框 */
      position: absolute;
      display: inline-block;
      width: 22px;
      height: 20px;
      cursor: pointer;
      border: 2px solid #ff8d1a;
      border-radius: 5px;
      -moz-transition: background-color 0.2s ease-in;
      -webkit-transition: background-color 0.2s ease-in;
      -o-transition: background-color 0.2s ease-in;
      transition: background-color 0.2s ease-in;
    }
    // span {
    //   margin-left: 2%;

    //   font-weight: 600;
    // }
    // .selectEvent,
    // .selected {
    //   color: #d97816;
    // }

    .checkbox {
      &::before,
      &::after {
        /* 上面的打勾 */
        content: "";
        position: absolute;
        width: 3px;
        background: $deposit-notice-checked-icon;
        -moz-transition: opacity 0.2s ease-in;
        -webkit-transition: opacity 0.2s ease-in;
        -o-transition: opacity 0.2s ease-in;
        transition: opacity 0.2s ease-in;
        opacity: 0;
      }
    }
    .checkbox {
      &::before {
        /* 打勾左邊的線 */
        height: 9px;
        top: 7px;
        left: 3px;
        -moz-transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
    }

    .checkbox {
      &::after {
        /* 打勾右邊的線 */
        height: 13px;
        top: 2px;
        left: 10px;
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }

    .checked {
      /* 當check時 按鈕顏色改變 */
      background: $deposit-notice-checked-bg;
    }

    .checkbox2 {
      &::before {
        opacity: 1;
      }
    }

    .checkbox2 {
      &::after {
        /* 當check時 打勾消失 */
        opacity: 1;
      }
    }

    // input {
    //   display: none;
    // }
    .contentWrap {
      // width: 100%;
      margin-left: 8%;
      p {
        margin: 1% 0 1%;
      }
      .eventType {
        display: flex;
        justify-content: space-between;
        width: 80%;
        .bonus {
          width: 40%;
          text-align: start;
        }
      }
    }
  }

  p {
    width: 97%;
    margin: 0 2%;
  }
}
.notice {
  padding: 1rem 2.5rem 0 2.5rem;
  text-align: center;
  color: green;
}
</style>
