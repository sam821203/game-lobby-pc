<template>
  <div class="base" :class="mode">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.base {
  padding: 32px;
  border-radius: $border-radius-md;
  background-color: $secondary-bg;
  line-height: 150%;
  color: $primary-white;
}
</style>
