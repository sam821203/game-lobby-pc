<template>
  <button :disabled="disabled" :class="['button', bgType, imgSrc, mode]">
    <!-- <img :src="require(`@/assets/images/form/${bgType}.png`)" alt="" /> -->
    <div class="d-flex-center">
      <img
        :src="require(`@/assets/images/${imgSrc}.png`)"
        :width="imgSize"
        alt=""
        v-if="hasImg"
      />
      <slot></slot>
    </div>
  </button>
</template>

<script setup>
// import { storeToRefs } from 'pinia';

defineProps({
  // disabledBtn, confirmBtn
  bgType: {
    type: String,
    default: "confirmBtn",
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  imgSrc: {
    type: String,
    required: false,
    default: "",
  },
  imgSize: {
    type: String,
    required: false,
    default: "44",
  },
  mode: {
    type: String,
    required: false,
    default: null,
  },
  hasImg: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// const { bgType, disabled } = storeToRefs(props);
const send = (cb) => {
  cb();
};

defineExpose({
  send,
});
</script>

<style lang="scss" scoped>
.button {
  padding: 0;
  font-weight: bold;
  color: #fff;
  line-height: 1.3;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
  user-select: none;
  cursor: pointer;
  .d-flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.big_confirmBtn {
    margin: auto;
    width: 80%;
    margin: 0 10%;
    height: 100%;
    background: $confirm-btn-bg;
    border-radius: $border-radius-md;
  }
}

.rounded {
  width: 200px;
  height: 40px !important;
  text-align: center;
  line-height: 40px;
  border-radius: $border-radius-md;
  background: $modal-key;
  &:hover {
    background: $button-selected-bg-darken;
    filter: brightness(94%);
  }
}
.secondary {
  width: 120px;
  background: $func-button-color-default;
  &:hover {
    background: $func-button-color-default-darken;
    filter: brightness(94%);
  }
}
.light {
  background: $anotherservice-btn-bg;
  &:hover {
    background: $anotherservice-btn-bg-darken;
    filter: brightness(94%);
  }
}
</style>
