<template>
  <div class="depositPopout">
    <p>
      Seu depósito anterior ainda não foi concluído, por favor, conclua-o
      primeiro.
    </p>
    <div class="btnWrap">
      <button class="gcash" @click="getOrderPath">
        Ir para o aplicativo PIX
      </button>
      <button class="return" @click="goBack">Retornar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getOrderApi } from "@/api/deposit";
import { useDeposit } from "@/store/depositStore";
import { storeToRefs } from "pinia";
// import { useModal } from "@/store/modalStore";
import { usectrlLogin } from "@/store/ctrlLogin";
const { depositPageStatus } = storeToRefs(usectrlLogin());
//
const router = useRouter();
const depositStore = useDeposit();
const { orderNum } = storeToRefs(depositStore);
const chargeUrl = ref("");
// const modalStore = useModal();
// const { toggleModal } = modalStore;

const getOrderPath = async () => {
  const res = await getOrderApi(orderNum.value);
  if (res.data.code === 0) {
    chargeUrl.value = res.data.data.order.content.charge_url;
    window.open(chargeUrl.value);
  }
};

const goBack = () => {
  // toggleModal(false);
  // router.go(-1);
  depositPageStatus.value = false;
  router.push("/home");
};
</script>

<style lang="scss" scoped>
.depositPopout {
  width: 100%;
  p {
    color: white;
    word-break: break-word;
    font-size: 1.2rem;
    text-align: left;
  }
  .btnWrap {
    margin-top: 1rem;
    text-align: center;
    .gcash {
      background-color: rgb(230, 127, 43);
      color: #fff;
      height: 2.5rem;
      border-radius: $border-radius-md;
      width: 90%;
    }
    .return {
      background-color: rgb(28, 138, 30);
      color: #fff;
      height: 2.5rem;
      border-radius: $border-radius-md;
      width: 40%;
      margin-top: 1rem;
    }
  }
}
</style>
