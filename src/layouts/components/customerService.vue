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
  width: 100%;
  height: 3rem;
  position: fixed;
  right: 0;
  bottom: 5rem;

  pointer-events: none;
  z-index: 100;
  img {
    position: absolute;
    height: 100%;
    object-fit: contain;
    background: transparent;
    right: 2rem;
    pointer-events: auto;
  }
}
</style>
