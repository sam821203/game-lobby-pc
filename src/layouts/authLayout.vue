<template>
  <div class="authWrap" v-show="loginpageStatus">
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
          :class="[
            'link-item',
            authStatus === 'login' ? 'selected' : 'notSelected',
          ]"
          @click="changeRoute('login')"
        >
          <p>{{ $t("register.registerPage") }}</p>
        </li>
        <li
          :class="[
            'link-item',
            authStatus === 'register' ? 'selected' : 'notSelected',
          ]"
          @click="changeRoute('register')"
        >
          <p style="font-size: 1rem; width: 100%">
            {{ $t("register.registration") }}
          </p>
        </li>
      </ul>
      <!-- <router-view></router-view> -->
      <login v-if="authStatus === 'login'" />
      <register v-if="authStatus === 'register'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUuid } from "@/utils/cookie";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import login from "@/views/auth/login.vue";
import register from "@/views/auth/register/index.vue";

import { useRoute } from "vue-router";
import { usectrlLogin } from "@/store/ctrlLogin";
const { loginpageStatus } = storeToRefs(usectrlLogin());
const route = useRoute();
const uuid = getUuid("uuid") !== undefined ? getUuid("uuid") : "";
console.log("uuid", uuid);

// const { setserviceConectData } = serviceConect();
const { useLanguage } = useStore();
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);

const authStatus = ref("login");

const changeRoute = (route) => {
  // router.push(route);
  authStatus.value = route;
};

// const openWebsite = (url) => {
//   window.open(url);
// };
const closeModal = () => {
  // usectrlLogin().$patch({
  //   loginpageStatus: false,
  // });
  loginpageStatus.value = false;
};
onMounted(() => {
  if (route.params.id) {
    authStatus.value = "register";
  }
});
</script>

<style lang="scss" scoped>
// rgba(73, 56, 96, 1)
// rgb(40, 32, 48)
.authWrap {
  // display: inline-block;
  // margin-top: $topBar-height;
  // background: rgba(73, 56, 96, 1);
  // background: red;
}
.link-list {
  li {
    img {
      width: 45px;
    }
  }
}
:deep(.input) {
  background: black;
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
