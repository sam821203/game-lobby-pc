<template>
  <div class="customerService">
    <img
      src="@/assets/images/layouts/service.png"
      alt="service"
      class="service"
      @click="setserviceConectData(true)"
    />
  </div>
</template>

<script setup>
import { serviceConect } from "@/store/serviceConnet";
const { setserviceConectData } = serviceConect();
</script>

<style lang="scss" scoped>
.customerService {
  pointer-events: none;
  // background: red;
  //   width: 4rem;
  height: 3rem;
  //   background: red;
  position: sticky;
  right: 0;
  bottom: 5rem;
  z-index: 100;
  //   overflow: hidden;
  img {
    position: absolute;
    height: 100%;
    object-fit: contain;
    background-color: transparent;
    right: 2rem;
    pointer-events: auto;
  }
}
</style>
