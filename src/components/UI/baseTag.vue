<template>
  <div class="base" :class="mode">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  mode: {
    type: [Number, String],
    required: false,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.base {
  height: 32px;
  padding-left: 8px;
  padding-right: 8px;
  text-align: center;
  line-height: 32px;
}

.rounded {
  background: $modal-key;
  border-radius: $border-radius-md;
}
</style>
