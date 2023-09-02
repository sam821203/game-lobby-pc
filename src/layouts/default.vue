<template>
  <div class="wrap">
    <main class="main" :class="{ notLogin: !token }">
      <router-view />
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<script setup>
// import Footer from "./components/footer.vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";

const { useAuth } = useStore();
const authStore = useAuth();
const { token } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin: $topBar-height 0 $downBar-height 0;
  // background: $primary;
  &.notLogin {
    // margin: $notLogin-topBar-height 0 $downBar-height 0;
  }
}
</style>
