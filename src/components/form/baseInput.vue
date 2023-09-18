<template>
  <label :for="label">
    {{ label }}
  </label>

  <div class="pos-relative">
    <div class="input-inner">
      <input
        v-bind="$attrs"
        :type="type"
        :class="[
          'input',
          { hasBtn: buttonText },
          { 'text-Right': textRight },
          mode,
        ]"
        :value="modelValue"
        @input="inputHandler($event)"
        :disabled="disabled"
        :autofocus="autofocus"
        ref="input"
      />
      <div class="country-codes" v-if="checkCountryCodes">+55</div>
      <img
        :src="require(`@/assets/images/form/${togglePwd ? 'eye2' : 'eye'}.png`)"
        alt=""
        @click.prevent="checkPwd"
        :class="[{ isClick: togglePwd }, 'eye']"
        v-show="propsType === 'password'"
      />
      <div
        :class="['functionBtn', !buttonDisabled ? 'A' : 'B']"
        v-show="buttonText"
        @click="checkFunction"
      >
        <!-- <img
          src="@/assets/images/form/A_btn.png"
          alt=""
          v-if="!buttonDisabled"
        /> -->
        <!-- <img src="@/assets/images/form/B_btn.png" alt="" v-else /> -->
        <span>{{ buttonText }}</span>
      </div>
    </div>
  </div>
  <span class="error" v-if="error">{{ $t(error) }}</span>
</template>

<script setup>
import { defineProps, toRefs, ref, nextTick, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  error: {
    type: String,
    default: "",
  },
  buttonText: {
    type: [String, Number],
    default: "",
  },
  buttonDisabled: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    required: false,
    default: null,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  textRight: {
    type: Boolean,
    default: false,
  },
});
const { type: propsType } = toRefs(props);
const input = ref(null);
const togglePwd = ref(false);
const type = ref(propsType.value);
const checkPwd = () => {
  togglePwd.value = !togglePwd.value;
  if (togglePwd.value) {
    type.value = "text";
  } else {
    type.value = "password";
  }
};
const emit = defineEmits(["update:modelValue", "inputFunction"]);

const checkFunction = () => {
  emit("inputFunction");
};
const inputHandler = ($event) => {
  const val =
    typeof $event.target.value === "string"
      ? $event.target.value.trim()
      : $event.target.value;
  emit("update:modelValue", val);
};
const checkCountryCodes = computed(() => props.mode === "codes");
// const globalStore = useGlobal()
// onMounted(() => {
//   input.value.addEventListener('focusin', (e) => {
//     globalStore.$patch({
//       isFocus: true
//     })
//   })
//   input.value.addEventListener('focusout', (e) => {
//     globalStore.$patch({
//       isFocus: false
//     })
//   })
// })

// onBeforeUnmount(() => {
//   reseizeWindow();
// });
const focus = () => {
  nextTick(() => {
    input.value.focus();
  });
};
defineExpose({
  focus,
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
label {
  white-space: nowrap;
}
.input-inner {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3%;
  .eye {
    position: absolute;
    width: 10%;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    @media (min-width: 1024px) {
      right: 4%;
    }
    @media (min-width: 1600px) {
      right: 6%;
    }
    &.isClick {
      // position: relative;
    }
  }
}
.input {
  @include input;
  background: $default-input-bg;
}
.text-Right {
  text-align: right;
}
label {
  display: inline-block;
  font-size: 18px;
  color: $primary;
  margin-right: 15px;
  margin-bottom: 1%;
}
.error {
  display: block;
  text-align: start;
  color: $error-color;
  // margin-bottom: 15px;
  font-size: 0.8rem;
}
.codes {
  width: 80%;
  border-radius: 0 $border-radius-md $border-radius-md 0;
  border-left: none;
}
.functionBtn {
  position: absolute;
  top: 50%;
  right: 1.5%;
  transform: translateY(-50%);
  width: 5rem;
  height: 2rem;
  cursor: pointer;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.A {
    border: 2px solid #1475e1;
    color: #1475e1;
  }
  &.B {
    border: 2px solid $modal-key;
    color: $modal-key;
  }
  img {
    width: 100%;
    height: 100%;
  }
  span {
    white-space: nowrap;
    text-align: center;
    font-size: 0.7rem;
  }
}
.pos-relative {
  position: relative;
}
.country-codes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20%;
  height: 2.5rem;
  min-width: 40px;
  padding-left: 6%;
  background: $default-input-bg;
  color: $default-input-color;
  border-radius: $border-radius-md 0 0 $border-radius-md;
  border: 1px solid $default-input-border;
  // border-right: none;
  text-align: center;
  line-height: 2.35rem;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    height: 20px;
    transform: translateY(-50%);
  }
  &::before {
    left: 12%;
    width: 20px;
    border-radius: 50%;
    background-image: url("@/assets/images/form/flag-brazil.png");
    background-size: cover;
    background-position: center;
  }
  &::after {
    left: 0;
    width: 100%;
  }
}
</style>
