<template>
  <div class="activityList">
    <div class="detail">
      <promotion v-if="activitySelected.selectStatus == 'promotion'" />
      <getRecord v-if="activitySelected.selectStatus == 'getRecord'" />
    </div>
  </div>
</template>

<script setup>
// import { ref } from "vue";
import { useRoute } from "vue-router";
import promotion from "@/components/activityList/promotion.vue";
import getRecord from "@/components/activityList/getRecord.vue";
import { useStore } from "@/store/index";

const route = useRoute();
const { useActivityList } = useStore();
const activitySelected = useActivityList();
if (route.query?.selected) activitySelected.selectStatus = "getRecord";
</script>

<style lang="scss" scoped>
.activityList {
  width: 100%;
  height: calc(100%);
  display: flex;
  flex-direction: column;
  .all {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    div {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      width: 45%;
      background-size: 100% 100%;
      word-break: keep-all;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div:nth-child(1) {
      background-image: url("@/assets/images/activityList/paging_L_1.png");
    }
    > div:nth-child(2) {
      background-image: url("@/assets/images/activityList/paging_R_1.png");
    }
    .selectedL {
      background-image: url("@/assets/images/activityList/paging_L_2.png") !important;
    }
    .selectedR {
      background-image: url("@/assets/images/activityList/paging_R_2.png") !important;
    }
  }
  .detail {
    height: calc(100% - 2.8rem);
  }
}
</style>
