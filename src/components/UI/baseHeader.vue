<template>
  <div class="header" :class="mode">
    <img
      :src="require(`@/assets/images/${imgSrc}.png`)"
      alt=""
      v-if="hasImage"
    />
    <div>{{ $t(content) }}</div>
  </div>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: false,
    default: null,
  },
  hasImage: {
    type: Boolean,
    required: false,
    default: true,
  },
  imgSrc: {
    type: String,
    required: false,
    default: "",
  },
  content: {
    type: String,
    required: true,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  img {
    width: 36px;
    margin-right: 8px;
  }
  div {
    font-size: 20px;
    font-weight: bold;
    line-height: 160%;
    color: $title;
  }
}
</style>
