<template>
  <div class="authWrap" style="width: 450px" v-show="changeTradePwd">
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("修改交易密碼") }}
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="main">
      <div class="login-wrap">
        <form @submit.prevent="editTradePwd">
          <BaseInput
            :label="$t('舊密碼')"
            :type="'password'"
            :placeholder="
              $t('register.wordLen', {
                min: 4,
                max: 6,
              })
            "
            v-model="oldpwd"
            class="input"
            :required="true"
            :error="errors.oldpwd"
            v-if="userInfo.is_set_second_password === true"
          />
          <BaseInput
            :label="$t('新交易密碼')"
            :type="'password'"
            :placeholder="
              $t('register.wordLen', {
                min: 4,
                max: 6,
              })
            "
            v-model="secpwd"
            class="input"
            :required="true"
            :error="errors.secpwd"
          />
          <BaseInput
            :label="$t('register.checkTradePwd')"
            :type="'password'"
            :placeholder="$t('register.wordLen', { min: 4, max: 6 })"
            v-model="confirm_second_password"
            class="input"
            :required="true"
            :error="errors.confirm_second_password"
          />
          <!-- <div class="confirmWrap">
          <baseButton
            :class="['button', { disabledBtn: hasError }]"
            type="submit"
            :disabled="hasError"
            :bg-type="hasError ? 'disabledBtn' : 'confirmBtn'"
          >
            {{ $t("memberCenter.confirmChangedPassword") }}
          </baseButton>
        </div> -->
          <button
            type="submit"
            :class="['button', 'submit', { disabledBtn: hasError }]"
          >
            {{ $t("memberCenter.confirmChangedPassword") }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import BaseInput from "@/components/form/baseInput.vue";
// import baseButton from "@/components/form/baseButton.vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store/index";
// import { isBoolean } from "@/utils/transType";
// import { useRoute } from "vue-router";
// const route = useRoute();

import { usectrlLogin } from "@/store/ctrlLogin";
const { changeTradePwd } = storeToRefs(usectrlLogin());

const { useAuth } = useStore();
const authStore = useAuth();
const { getUserInfo } = authStore;
const { userInfo } = storeToRefs(authStore);
// const setTradeCode = computed(() => isBoolean(route.query.setTradeCode));

import { object } from "yup";
import { useField, useForm } from "vee-validate";
import { editTradeCodeApi } from "@/api/user";
import { useMessage } from "@/store/msgStore";
import {
  tradePasswordValidate,
  confirmTradePwdValidate,
  oldTradePwdValidate,
} from "@/utils/validate";
import { useI18n } from "vue-i18n";
// import { useRouter } from "vue-router";
// const router = useRouter();
// const route = useRoute();

const msg = useMessage();
const { openMsg } = msg;
const { t } = useI18n();

watch(changeTradePwd, (v) => {
  if (v) {
    getUserInfo();
  }
});

const hasError = computed(() => {
  return (
    Object.keys(errors.value).length > 0 ||
    !secpwd.value ||
    !confirm_second_password.value
  );
});

const validationSchema = object({
  oldpwd:
    userInfo.value.is_set_second_password === true ? oldTradePwdValidate : "",
  secpwd: tradePasswordValidate,
  confirm_second_password: confirmTradePwdValidate,
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: secpwd } = useField("secpwd");
const { value: oldpwd } = useField("oldpwd");
const { value: confirm_second_password } = useField(
  "confirm_second_password",
  ""
);

const editTradePwd = handleSubmit(async (values) => {
  const { oldpwd, secpwd } = values;
  const res = await editTradeCodeApi({
    old_password: userInfo.value.is_set_second_password === true ? oldpwd : "",
    new_password: secpwd,
  });
  console.log(res);

  try {
    if (res.data.code === 0) {
      await openMsg({
        content: t("已更改交易密碼"),
      }).then(() => {
        closeModal();
      });
    }
  } catch (error) {
    console.log(error);
  }
});
const closeModal = () => {
  changeTradePwd.value = false;
};
</script>

<style lang="scss" scoped>
:deep(.input) {
  height: 3rem;
}
.confirmWrap {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  .button {
    width: 30%;
    padding: 4%;
  }
}
</style>
