<template>
  <div class="select-group">
    <label
      v-for="(option, index) in optionList"
      :key="index"
      @click="selectState(option.id, option.option)"
    >
      <input type="radio" name="btn-text" :checked="index === 0" />
      <div class="btn-text">{{ $t(option.option) }}</div>
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(["selectStateFunc"]);

const selectState = (id, option) => {
  emit("selectStateFunc", id, option);
};

defineProps({
  mode: {
    type: String,
    required: false,
    default: null,
  },
  showStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  curStatus: {
    type: String,
    required: true,
  },
  statusList: {
    type: Boolean,
    required: true,
  },
  optionList: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.select-group {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  label {
    display: inline-block;
    width: 120px;
    height: 40px;
    margin-left: 6px;
    margin-right: 6px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  .btn-text {
    border-radius: $border-radius-md;
    background-color: $button-disabled;
    transition: all 0.2s ease;
    &:hover {
      background: darken($button-disabled, 6%);
    }
  }
  input {
    display: none;
  }
  input:checked + .btn-text {
    background-color: $modal-key;
    &:hover {
      background: darken($modal-key, 6%);
    }
  }
}
</style>
