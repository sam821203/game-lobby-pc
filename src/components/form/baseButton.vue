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
      <span>
        <slot></slot>
      </span>
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
  background-color: transparent;
  border: none;
  transition: all 0.2s ease;
  cursor: pointer;
  .d-flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.big_confirmBtn {
    margin: auto;
    width: 80%;
    height: 100%;
    background: $modal-key;
    border-radius: 10px;
  }
}

.rounded {
  width: 200px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: $border-radius-md;
  background-color: $modal-key;
  &:hover {
    background: darken($modal-key, 6%);
  }
}
.secondary {
  width: 120px;
  background-color: $secondary-btn;
  &:hover {
    background: darken($secondary-btn, 6%);
  }
}
.light {
  background-color: $modal-key-light;
  &:hover {
    background: darken($modal-key-light, 6%);
  }
}
</style>
