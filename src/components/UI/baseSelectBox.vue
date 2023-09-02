<template>
  <div class="status-group" :class="mode">
    <div @click="showStatus">{{ $t(curStatus) }}</div>
    <div :class="['arrow', { openArrow: statusList }]"></div>

    <ul v-if="statusList" class="option-list">
      <li
        class="status-option"
        v-for="(option, index) in optionList"
        :key="index"
        @click="selectState(option.id, option.option)"
      >
        <span>{{ $t(option.option) }}</span>
      </li>
    </ul>
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
.status-group {
  width: 80%;
  height: 2rem;
  border: 1px solid gray;
  margin: 5% auto 0;
  border-radius: 5px;
  text-align: center;
  line-height: 2rem;
  background: #470c85;
  position: relative;
  z-index: 1;
  .arrow {
    width: 12px;
    height: 12px;
    border: 1px solid gray;
    border-width: 1px 1px 0 0;
    transform: rotate(135deg);
    margin-bottom: 10px;
    position: absolute;
    top: 20%;
    right: 5%;
  }
  .openArrow {
    position: absolute;
    top: 40%;
    right: 5%;
    transform: rotate(-45deg);
  }
}
.option-list {
  margin: 0 auto;
  text-align: center;
  border: 1px solid gray;
  border-radius: 5px;
  background: rgb(35, 3, 61);
  .status-option {
    line-height: 2rem;
    height: 2rem;
  }
}
</style>
