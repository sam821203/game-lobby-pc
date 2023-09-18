<template>
  <div class="authWrap" v-show="loginpageStatus || registerpageStatus">
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
          :class="['link-item', loginpageStatus ? 'selected' : 'notSelected']"
          @click="changeRoute('login')"
        >
          <p>{{ $t("register.registerPage") }}</p>
        </li>
        <li
          :class="[
            'link-item',
            registerpageStatus ? 'selected' : 'notSelected',
          ]"
          @click="changeRoute('register')"
        >
          <p style="font-size: 1rem; width: 100%">
            {{ $t("register.registration") }}
          </p>
        </li>
      </ul>
      <login v-if="loginpageStatus" />
      <register v-if="registerpageStatus" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import login from "@/views/auth/login.vue";
import register from "@/views/auth/register/index.vue";

import { useRoute } from "vue-router";
import { usectrlLogin } from "@/store/ctrlLogin";
const { loginpageStatus, registerpageStatus } = storeToRefs(usectrlLogin());
const route = useRoute();

// const { setserviceConectData } = serviceConect();
const { useLanguage } = useStore();
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);

const closeModal = () => {
  loginpageStatus.value = false;
  registerpageStatus.value = false;
};
const changeRoute = (route) => {
  if (route == "login") {
    loginpageStatus.value = true;
    registerpageStatus.value = false;
  } else {
    loginpageStatus.value = false;
    registerpageStatus.value = true;
  }
};
onMounted(() => {
  if (route.params.id) {
    registerpageStatus.value = true;
  }
});
</script>

<style lang="scss" scoped>
.link-list {
  li {
    img {
      width: 45px;
    }
  }
}
// :deep(.input) {

// }
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
