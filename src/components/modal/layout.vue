<template>
  <div class="popout_page">
    <div class="bg" @click.self="clickBg"></div>

    <div class="page" :style="{ width: pageWidth, height: pageHeight }">
      <div class="title" v-if="$slots.title">
        <slot name="title" />
        <img
          src="@/assets/images/layouts/close.png"
          class="close"
          @click="closePopoutFunc"
          v-if="closeBtn"
        />
      </div>
      <div
        :class="[
          'content',
          {
            notitle: !$slots.title,
          },
        ]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useModal } from "@/store/modalStore";
const modalStore = useModal();
const { closeBtn } = storeToRefs(useModal());
const { toggleModal } = modalStore;
// const { childView } = storeToRefs(modalStore);
// const modalType = {
//   longContent: require("@/assets/images/modal/pop_box4.png"),
// };
// const { styleType } = storeToRefs(modalStore);
// const curStyle = computed(() => modalType[styleType.value]);
const clickBg = () => {
  // toggleModal(false);
  closePopoutFunc();
  return;
};
const closePopoutFunc = () => {
  toggleModal(false);
  // announcementBriefPage.value = false;
};
defineProps({
  pageWidth: {
    type: String,
    default: "",
  },
  pageHeight: {
    type: String,
    default: "",
  },
});
</script>
