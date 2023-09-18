<template>
  <div
    class="authWrap"
    style="width: 500px; height: 400px"
    v-if="addpixPageStatus"
  >
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">
        {{ $t("新增PIX") }}
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
          <label>{{ $t("PIX Type") }}</label>
          <div class="chooseType" @click="showOption = !showOption">
            <p :class="['placeholder', { type: choseType }]">
              {{ !choseType ? $t("請選擇Type") : choseType }}
            </p>
            <img
              src="@/assets/images/modal/list_open1.png"
              :class="['notOpen', { open: showOption }]"
            />
          </div>

          <div class="typeOptions" v-show="showOption">
            <ul v-for="(option, index) in pxTypeOptions" :key="index">
              <li
                class="option"
                @click="chooseType(option.option, option.abbr)"
              >
                {{ option.option }}
              </li>
            </ul>
          </div>
        </div>
        <div class="input-wrap">
          <BaseInput
            :label="$t('PIX Key')"
            :placeholder="$t('請輸入PIXKey')"
            :required="true"
            v-model="pixKey"
            @keyup.enter="confirm"
          />
        </div>
      </div>
    </div>
    <button
      :class="[
        'confirm',
        {
          disabled: type === null || pixKey === null || pixKey === '',
        },
      ]"
      @click="confirm"
      :disabled="type === null || pixKey === null || pixKey === ''"
    >
      {{ $t("stored.OK") }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import BaseInput from "@/components/form/baseInput.vue";
// import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
import { addGCashApi } from "@/api/deposit";
import { usectrlLogin } from "@/store/ctrlLogin";
const { addpixPageStatus, withdrawalPageStatus } = storeToRefs(usectrlLogin());
// const depositStore = useDeposit();
// const taxId = ref(null);
// const phone = ref(null);
const choseType = ref(null);
const type = ref(null);
const pixKey = ref(null);
const showOption = ref(false);
const pxTypeOptions = reactive([
  { option: "CPF：Cadastro de Pessoas Físicas", abbr: "CPF" },
  { option: "CNPJ：Cadastro Nacional da Pessoa Jurídica", abbr: "CNPJ" },
  { option: "EMAIL：Endereço de e-mail", abbr: "EMAIL" },
  { option: "PHONE：Número de telefone", abbr: "PHONE" },
  { option: "EVP：Chave aleatória", abbr: "EVP" },
]);

const chooseType = (option, abbr) => {
  choseType.value = option;
  type.value = abbr;
  showOption.value = !showOption.value;
};

const confirm = async () => {
  const addGCashRes = await addGCashApi({
    pixkey: pixKey.value,
    pixtype: type.value,
  });
  console.log(addGCashRes);
  closeModal();
};
const closeModal = () => {
  addpixPageStatus.value = false;
  withdrawalPageStatus.value = true;
};
</script>

<style lang="scss" scoped>
:deep .input {
  // baseInput有自己的樣式，用這強制修改
  border: 2px solid $withdraw-deposit-input-border;
  // color: rgba(166, 166, 166, 1);
}
.input-wrap {
  margin-top: 10px;
  position: relative;
  .chooseType {
    position: relative;
    width: 100%;
    height: 2.5rem;
    padding: 0 10px;
    background: $default-input-bg;
    border-radius: $border-radius-md;
    border: 2px solid $withdraw-deposit-input-border;
    user-select: none;
    display: flex;
    align-items: center;
    .placeholder {
      color: $default-input-placeholder-color;
    }
    .type {
      color: $primary;
    }
  }
  .notOpen {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 4%;
    right: 3%;
    &.open {
      position: absolute;
      // top: 57%;
      transform: translateY(-50%) scaleY(-1);
    }
  }
  .typeOptions {
    position: absolute;
    z-index: 1;
    width: calc(100% - 6px);
    background: $button-disabled-bg;
    // border: 1px solid;
    border-radius: 5px;
    left: 50%;
    margin-top: 3px;
    transform: translateX(-50%);
    overflow: hidden;
    ul {
      li {
        padding: 2%;
      }
      li:hover {
        background: $canclick-pageBtn-bg;
      }
    }
  }
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
    color: $primary;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.disabled {
    background: $button-disabled-bg;
  }
}
</style>
