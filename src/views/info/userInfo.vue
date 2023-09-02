<template>
  <div class="authWrap" v-show="userInfosetting">
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("基本資料") }}
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="main">
      <div class="login-wrap">
        <div class="input-wrap">
          <BaseInput
            :label="$t('stored.account')"
            v-model="userInfo.account"
            :required="true"
            :disabled="true"
            :textRight="true"
          />
        </div>
        <div class="input-wrap input-wrap2">
          <div class="w-90">
            <BaseInput
              v-if="editInput"
              :label="$t('register.name')"
              :placeholder="$t('login.fillInAccount')"
              v-model="userInfo.real_name"
              :autofocus="true"
              :required="true"
              :textRight="true"
            />
            <BaseInput
              v-else
              :label="$t('register.name')"
              :placeholder="$t('login.fillInAccount')"
              v-model="userInfo.real_name"
              :required="true"
              :disabled="true"
              :textRight="true"
            />
          </div>

          <div class="edit-wrap">
            <img
              src="@/assets/images/memberCenter/write.png"
              alt=""
              :class="['edit', { editing: editInput }]"
              @click="edit"
              v-if="!editInput"
            />
            <div class="mb-8" v-if="editInput" @click="editCheck()">✔</div>
          </div>
        </div>

        <div class="input-wrap">
          <BaseInput
            :label="$t('register.phone')"
            v-model="userInfo.phone"
            :required="true"
            :disabled="true"
            :textRight="true"
          />
        </div>
        <!--  -->
        <button
          class="button w-80 canclickBtn teach"
          @click="gotochangeLoginPwdPage"
        >
          <img src="@/assets/images/memberCenter/lock.png" />
          <span> {{ $t("修改密碼") }}</span>
        </button>
        <button
          class="button w-80 canclickBtn teach"
          @click="gotochangeTradePwdPage"
        >
          <img src="@/assets/images/memberCenter/money.png" />
          <span> {{ $t("修改交易密碼") }} </span>
        </button>
        <!--  -->
        <button type="submit" class="button submit" @click="save(name)">
          {{ $t("login.submit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from "@/components/form/baseInput.vue";
import { ref } from "vue";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { editRealNameApi } from "@/api/user";
import { usectrlLogin } from "@/store/ctrlLogin";

const { userInfosetting, changeLoginPwd, changeTradePwd } = storeToRefs(
  usectrlLogin()
);
const { useMessage } = useStore();
const { openMsg } = useMessage();
// import { onMounted } from "vue";

const { useAuth } = useStore();
const auth = useAuth();
// const { getUserInfo } = auth;
const { userInfo } = storeToRefs(auth);
const authStore = useAuth();
const { getUserInfo } = authStore;
const editInput = ref(false);
// const name = ref(userInfo.value.real_name);

const edit = () => {
  editInput.value = !editInput.value;
  // name.value = userInfo.value.real_name;
};

const editCheck = async () => {
  // console.log(name);
  const name = userInfo.value.real_name;
  // console.log(name.length);
  if (
    name
      .toString()
      .match(/^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]{2,60}$/)
  ) {
    editInput.value = !editInput.value;
  } else {
    getUserInfo();
    openMsg({
      content: "Error, only 2-60 English.",
    })
      .then(() => {
        editInput.value = !editInput.value;
      })
      .catch(() => {
        editInput.value = !editInput.value;
      });
    // console.log(name);
    console.log(userInfo.value.real_name);
  }
};

const save = async () => {
  const name = userInfo.value.real_name;
  editInput.value = !editInput.value;
  const res = await editRealNameApi({ real_name: name });
  if (res.data.code === 0) {
    getUserInfo();
  }
  console.log(res);
};

const closeModal = () => {
  userInfosetting.value = false;
};
const gotochangeLoginPwdPage = () => {
  closeModal();
  changeLoginPwd.value = true;
};
const gotochangeTradePwdPage = () => {
  closeModal();
  changeTradePwd.value = true;
};
</script>

<style lang="scss" scoped></style>
