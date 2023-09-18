<template>
  <div class="block" v-show="mylistStatus" @click="closeModal"></div>
  <!-- v-model:receiveNumModal="receiveNumModal" -->
  <div class="detailList" v-show="mylistStatus">
    <div class="top">
      <div class="left">
        <div class="pic">
          <img src="@/assets/images/lobby/vip_icon.png" />
          <span class="">VIP{{ userInfo?.vip_level }}</span>
        </div>
        <span>
          {{ userInfo?.account }}
        </span>
      </div>
      <div class="right">
        <span> {{ $t("邀請好友_我的列表") }}</span>
        <img
          v-show="!userInfo.is_test"
          src="@/assets/images/myList/add.png"
          alt="add"
          @click="openQRcode"
        />
      </div>
    </div>
    <div class="bottom">
      <div
        class="item"
        v-for="(v, k) in itemList"
        :key="k"
        @click="buttonSwitch(k)"
      >
        <!-- {{ v }} -->
        <img :src="require(`@/assets/images/myList/${k}.png`)" alt="" />
        <span>{{ $t(v) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";

const { useAuth, useModal, useMessage, useActivityList } = useStore();
//
const authStore = useAuth();
const { getUserInfo } = authStore;
const { userInfo } = storeToRefs(authStore);
const { logout } = authStore;
//
const modalStore = useModal();
const msg = useMessage();
const activitySelected = useActivityList();
const { openMsg } = msg;
const { toggleModal, modalType } = modalStore;
//
import i18n from "@/utils/i18n";
const { t } = i18n.global;
//
import { usectrlLogin } from "@/store/ctrlLogin";
const {
  userInfosetting,
  bgmStatus,
  depositPageStatus,
  withdrawalPageStatus,
  inviteFriends,
} = storeToRefs(usectrlLogin());
const { changeloginpageStatus } = usectrlLogin();
//
import { serviceConect } from "@/store/serviceConnet";
const { setserviceConectData } = serviceConect();
//
import { useRouter } from "vue-router";
const router = useRouter();
// useRoute
// const route = useRoute();
//
// const props =
defineProps({
  mylistStatus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:mylistStatus"]);
const closeModal = () => {
  emit("update:mylistStatus", false);
};
//
//邀請好友
const openQRcode = () => {
  // toggleModal(true);
  // modalType("FriendQRcode", "longContent");
  inviteFriends.value = true;
  closeModal();
};
//
const conditionVerify = async () => {
  await getUserInfo();
  if (
    userInfo.value.real_name &&
    userInfo.value.is_deposit &&
    userInfo.value.is_set_second_password
  ) {
    withdrawalPageStatus.value = true;
  }
  if (!userInfo.value.real_name) {
    //有無寫姓名
    openMsg({
      content: t("請先填寫您的真實姓名"),
    }).then(() => {
      // router.push("/info/userInfo");
      userInfosetting.value = true;
    });
    return;
  }
  if (!userInfo.value.is_deposit) {
    //有無存款過
    openMsg({
      content: t("請先進行存款"),
    }).then(() => {
      depositPageStatus.value = true;
    });
    return;
  }
  if (!userInfo.value.is_set_second_password) {
    //有無存款過
    openMsg({
      content: t("請先設定交易密碼"),
    }).then(() => {
      userInfosetting.value = true;
    });
    return;
  }
};
//
const itemList = {
  deposit_2: "player.deposit",
  DrawMoney: "player.withdraw",
  Vip: "VIP",
  InviteFriends: "player.friends",
  BetRecord: "player.data",
  TransactionRecord: "player.transactions",
  record: "player.participation",
  BasicInformation: "player.profile",
  CustomerService: "player.support",
  Logout: "player.logOut",
};
//

const buttonSwitch = (type) => {
  switch (type) {
    case "deposit_2":
      depositPageStatus.value = true;
      break;
    case "DrawMoney":
      conditionVerify();
      break;
    case "Vip":
      router.push("/operation/vip");
      break;
    case "InviteFriends":
      router.push("/operation/friends");
      break;
    case "BetRecord":
      router.push("/operation/gameRecord");
      break;
    case "TransactionRecord":
      router.push("/operation/tradeRecord");
      break;
    case "record":
      activitySelected.selectStatus = "getRecord";
      router.push({
        path: "/activity/activityList",
        query: { selected: "getRecord" },
      });
      break;
    case "BasicInformation":
      // router.push("/info/userInfo");
      // 0829
      userInfosetting.value = true;
      break;
    case "CustomerService":
      setserviceConectData(true);
      break;
    case "Logout":
      openMsg({
        content: t("logoutMsg"),
        hasBtn: true,
      }).then(() => {
        logout();
        router.push("/home");
        // usectrlLogin().$patch({
        //   loginpageStatus: true,
        // });
        // if (type) {
        //   return;
        // }
        changeloginpageStatus(true);
      });
      break;
    // 以下都沒用到
    case "email":
      toggleModal(true);
      modalType("Email", "longContent");
      break;
    case "setting":
      // router.push("/setting/sound");
      bgmStatus.value = true;
      break;
    // case "drawMoneySetting":
    //   router.push("/deposit/gCashSetting");
    //   break;
    case "QA":
      router.push("/info/aboutUs/Q&A");
      break;
    case "fb":
      window.open("https://www.facebook.com/profile.php?id=100095419832273");
      break;
    case "telegram":
      window.open("https://t.me/evostake");
      break;
    case "platformRule":
      router.push("/info/platformRule");
      break;
    // case "detailpromotionActivity":
    //   router.push("/deposit/safeSetting");
    //   break;
  }
  closeModal();
};
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0%;
  height: calc(100vh);
  padding: 0 1rem;
  opacity: 0.5;
  z-index: $myList-index;
}
.detailList {
  width: 422px;
  position: fixed;
  box-shadow: border-box;
  top: $topBar-height;
  right: calc(1rem + 5px);
  padding: 0 12px;
  border-radius: $border-radius-md;
  background: $canclick-pageBtn-bg;
  background-size: 100% 100%;
  color: white;
  z-index: calc($myList-index + 1);
  .top {
    width: 100%;
    height: 83px;
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
    }
    .left {
      align-items: center;
      min-width: 50%;
      .pic {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          height: 39px;
          object-fit: contain;
        }
        span {
          color: rgba(255, 141, 26, 1);
        }
      }
      > span {
        margin-left: 0.5rem;
      }
    }
    .right {
      align-items: center;
      justify-content: flex-end;
      span {
        margin-right: 5px;
      }
      img {
        height: 38px;
        object-fit: contain;
      }
    }
  }
  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
      width: calc(50% - 5px);
      padding: 6px 10px;
      margin-bottom: 13px;
      box-sizing: border-box;
      background: $my-func-button-bg;
      border-radius: $border-radius-md;
      img {
        height: 100%;
        object-fit: contain;
      }
      span {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
