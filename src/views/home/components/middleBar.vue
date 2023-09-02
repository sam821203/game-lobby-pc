<template>
  <div class="middleBar">
    <Marquee />
  </div>
</template>

<script setup>
import Marquee from "@/layouts/components/marquee.vue";
</script>

<style lang="scss" scoped>
.middleBar {
  width: calc(100% - 10px);
  padding: 5px 5px 0 5px;
}
</style>
