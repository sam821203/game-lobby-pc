<template>
  <div class="authWrap" style="width: 450px" v-show="changeLoginPwd">
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("修改密碼") }}
      </div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>

    <div class="main">
      <div class="login-wrap">
        <form @submit.prevent="editPassWord">
          <baseInput
            :label="$t('memberCenter.oldPassword')"
            :type="'password'"
            :placeholder="$t('memberCenter.fillInOldPassword')"
            class="input"
            :required="true"
            v-model="oldPassword"
            :error="errors.oldPassword"
          />
          <baseInput
            :label="$t('memberCenter.newPassword')"
            :type="'password'"
            :placeholder="$t('memberCenter.fillInNewPassword')"
            class="input"
            :required="true"
            v-model="newPassword"
            :error="errors.newPassword"
          />
          <baseInput
            :label="$t('memberCenter.confirmPassword')"
            :type="'password'"
            :placeholder="$t('memberCenter.fillInConfirmPassword')"
            class="input"
            :required="true"
            v-model="confirmPassword"
            :error="errors.confirmPassword"
          />
          <!-- <baseButton
            :class="['button', { disabledBtn: hasError }]"
            type="submit"
            :disabled="hasError"
            :bg-type="hasError ? 'disabledBtn' : 'confirmBtn'"
          >
            {{ $t("memberCenter.confirmChangedPassword") }}
          </baseButton> -->
          <!-- @click="save(name)" -->
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
// import { ref } from "vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { editPasswordApi } from "@/api/user";
import { useField, useForm } from "vee-validate";
import { object } from "yup";
import { useMessage } from "@/store/msgStore";
import { passwordValidate, confirmPwdValidate } from "@/utils/validate";
import { useRouter } from "vue-router";
import baseInput from "@/components/form/baseInput.vue";
// import baseButton from "@/components/form/baseButton.vue";
import { useI18n } from "vue-i18n";
import { usectrlLogin } from "@/store/ctrlLogin";
import { usepopoutNotice } from "@/store/popoutNotice";
const { countDownWidth } = storeToRefs(usepopoutNotice());
const { changeLoginPwd } = storeToRefs(usectrlLogin());

const { t } = useI18n();

const router = useRouter();

const msg = useMessage();
const { openMsg } = msg;

// const activitySelected = ref("login");
// const changeAct = (e) => {
//   switch (e) {
//     case "login":
//       break;
//     case "trade":
//       break;
//   }
//   activitySelected.value = e;
// };
const hasError = computed(() => {
  return (
    Object.keys(errors.value).length > 0 ||
    !oldPassword.value ||
    !newPassword.value ||
    !confirmPassword.value
  );
});

const validationSchema = object({
  oldPassword: passwordValidate,
  newPassword: passwordValidate,
  confirmPassword: confirmPwdValidate("newPassword"),
});
// const { resetForm } = useForm();
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
});

const { value: oldPassword } = useField("oldPassword");
const { value: newPassword } = useField("newPassword");
const { value: confirmPassword } = useField("confirmPassword");

const editPassWord = handleSubmit(async (values) => {
  const { oldPassword, newPassword } = values;
  if (countDownWidth.value > 0) {
    return;
  }

  try {
    const res = await editPasswordApi({
      old_password: oldPassword,
      new_password: newPassword,
    });
    if (res.data.code === 0) {
      try {
        await openMsg({
          content: t("openMsg.editPasswordSuccess"),
        }).then(() => {
          router.push("/");
          closeModal();
        });
      } catch (error) {
        openMsg({
          content: res.data.data.msg,
        });
      }
    }
  } catch (err) {
    if (countDownWidth.value > 0) {
      resetForm();
      return;
    }
  }
});
const closeModal = () => {
  changeLoginPwd.value = false;
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
