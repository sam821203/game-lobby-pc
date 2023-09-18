<template>
  <div class="navBar" :class="{ notLogin: !token }">
    <div class="navList" :class="{ notLogin: !token }">
      <div class="left-item">
        <img
          :src="
            require(`@/assets/images/layouts/menu_${listStatus ? 2 : 1}.png`)
          "
          @click="switchlistStatus"
          class="list"
        />
        <img
          :src="require(`@/assets/images/i18n/${curLang?.name}/homeLogo.png`)"
          alt="logo"
          class="logo"
          @click="goHome"
        />
      </div>
      <ul class="nav-items-list" v-if="!token">
        <li class="button login" @click="callAuth(false)">
          {{ $t("登入") }}
        </li>
        <li class="button register" @click="callAuth(true)">
          {{ $t("註冊") }}
        </li>
      </ul>
      <ul class="link-list" v-else>
        <div class="account" @click="switchMyList">
          <img src="@/assets/images/lobby/avatar.png" alt="" />
          <span>
            {{ userInfo?.account }}
          </span>
        </div>
        <div class="balance" @click="depositPageStatus = true">
          <img src="@/assets/images/COIN1.png" class="coin1" />
          <span
            v-price="balanceData[walletType]?.balance"
            style="vertical-align: middle"
          ></span>
          <!-- <span style="vertical-align: middle" v-else>0</span> -->
        </div>

        <router-link to="/operation/vip" class="icon-link">
          <img src="@/assets/images/lobby/vip_icon.png" alt="vip" class="vip" />
          <span class="vipLv">VIP{{ userInfo?.vip_level }}</span>
        </router-link>
        <!--  -->
        <div class="email-wrap">
          <div class="dot" v-if="isShowUnread === true"></div>
          <img
            src="@/assets/images/memberCenter/email.png"
            alt=""
            class="email"
            @click="buttonSwitch('email')"
          />
        </div>
      </ul>
    </div>
    <!-- <detailList :listStatus="listStatus" v-model:listStatus="listStatus" /> -->
  </div>
</template>

<script setup>
// import { ref } from "vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { usectrlLogin } from "@/store/ctrlLogin";
import { useRouter } from "vue-router";
import { useMail } from "@/store/mailStore";

const { useModal } = useStore();
const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const mailStore = useMail();
const { isShowUnread } = storeToRefs(mailStore);

// import detailList from "./detailnavList.vue";
//
//
const router = useRouter();
const { useAuth, useLanguage, useSsevent } = useStore();
const authStore = useAuth();

const lang = useLanguage();
const { curLang } = storeToRefs(lang);
const sseStore = useSsevent();
const { balanceData } = storeToRefs(sseStore);
const { token, userInfo, walletType } = storeToRefs(authStore);
// const token = ref(false);

const { depositPageStatus } = storeToRefs(usectrlLogin());
const callAuth = (v) => {
  usectrlLogin().$patch({
    loginpageStatus: !v,
    registerpageStatus: v,
  });
};

const goHome = () => {
  router.push("/home");
};
//
const buttonSwitch = (type) => {
  switch (type) {
    case "email":
      toggleModal(true);
      modalType("Email", "longContent");
      break;
  }
};
// const listStatus = ref(false);
const props = defineProps({
  listStatus: {
    type: Boolean,
    default: false,
  },
  mylistStatus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:listStatus", "update:mylistStatus"]);
const switchlistStatus = () => {
  emit("update:listStatus", !props.listStatus);
};
const switchMyList = () => {
  emit("update:mylistStatus", !props.mylistStatus);
};
</script>

<style lang="scss" scoped>
.navBar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: $topBar-index;
  height: $topBar-height;
  background: $indexNavbar-color;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  &.notLogin {
    height: $notLogin-topBar-height;
  }
  // @include breakpoint-up("lg") {
  //   max-width: 470px;
  // }
  .navList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: $topBar-height;
    position: relative;
    &.notLogin {
      align-items: center;
    }
    .left-item {
      height: 100%;
      display: flex;
      align-items: center;
      // justify-content: space-evenly;
      width: 30%;
      .service {
        width: 50%;
      }
      .pixiWrap {
        position: relative;
        .free88 {
          width: 100%;
        }
        .link {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 999;
        }
      }
    }
    .list {
      margin-right: 0.5rem;
      height: 1.5em;
      object-fit: contain;
    }
    .logo {
      height: 1.5em;
      object-fit: contain;
    }
    .link-list {
      display: flex;
      width: 60%;
      height: 100%;
      // color: white;
      align-items: center;
      justify-content: flex-end;
      div {
        display: flex;
        height: 65%;
        color: $primary;
      }
      li {
        img {
          width: 40px;
        }
      }
      .account {
        border-radius: 20px;
        padding: 5px 15px;
        background: $canclick-pageBtn-bg;
        font-size: 1.2rem;
        font-weight: bold;
        align-items: center;
        img {
          height: 100%;
          object-fit: contain;
          margin-right: 10px;
        }
      }
      .balance {
        padding: 5px;
        font-size: 1.2rem;
        font-weight: bold;
        align-items: center;
        .coin1 {
          height: 100%;
          object-fit: contain;
          // margin-right: 10px;
        }
      }
      .icon-link {
        width: 43px;
        height: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: $canclick-pageBtn-bg;
        border-radius: 50%;
        margin-left: 0.5em;
        text-decoration: none;
        img {
          height: 35%;
          object-fit: contain;
          margin-bottom: 3px;
        }
        .vipLv {
          color: $primary;
          font-size: 10px;
        }
      }
      .email-wrap {
        padding: 5px;
        height: 45px;
        margin: 0px 5px;
        position: relative;
        .email {
          height: 100%;
          object-fit: contain;
        }
        .dot {
          pointer-events: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: $error-color;
          position: absolute;
          right: 2px;
          top: 2px;
        }
      }
    }
    @keyframes topAni {
      0% {
        transform: scale(100%);
      }
      40% {
        transform: scale(96%);
      }
      // 80% {
      //   transform: scale(110%);
      // }
      100% {
        transform: scale(100%);
      }
    }
    @keyframes bottomAni {
      0% {
        transform: scale(100%);
        box-shadow: 0 0 5px 5px rgba(rgb(99, 99, 99), $alpha: 0);
      }
      40% {
        transform: scale(96%);
        box-shadow: 0 0 5px 5px rgba(rgb(69, 69, 69), $alpha: 0.5);
      }
      100% {
        transform: scale(100%);
        box-shadow: 0 0 5px 5px rgba(rgb(99, 99, 99), $alpha: 0);
      }
    }
    // animation: activity 2s infinite ease;
    .nav-items-list {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .button {
        // width: 7%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        border-radius: 16px;
        margin-right: -0.5%;
        text-decoration: none;
        padding: 5px 15px;
        color: #fff;
        position: relative;
        animation-name: topAni;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        &.register {
          background: $func-button-color-default;
        }
        &.login {
          background: $anotherservice-btn-bg;
          // background-image: linear-gradient(to top right, #8400b0, #a903d2);
        }
        a {
          color: #fff;
          text-decoration: none;
          padding: 5px 15px;
        }
        &:after {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: -1;
          content: "";
          border-radius: 16px;

          animation-name: bottomAni;
          animation-duration: 1s;
          // animation-delay: 5s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      }
      &.lang {
        width: 1rem;
      }
      display: flex;
      &.isLogin {
        width: 11rem;
        height: 3rem;
        background-image: url("~@/assets/images/layouts/coin_bar1.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        .balanceWrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 10px;
          .balance {
            color: #fff;
            font-size: 20px;
          }
          .coinImg {
            width: 31px;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
    :deep(.curlang) {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
