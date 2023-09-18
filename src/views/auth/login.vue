<template>
  <div class="login-wrap">
    <form @submit.prevent="throttleLoginHanlder">
      <div class="input-wrap">
        <BaseInput
          :label="$t('login.account')"
          :placeholder="$t('login.fillInAccount')"
          v-model="account"
          :required="true"
          :error="errors.account || ''"
        />
      </div>
      <div class="input-wrap">
        <BaseInput
          :label="$t('login.password')"
          :placeholder="$t('login.fillInPassword')"
          v-model="password"
          type="password"
          :required="true"
          :error="errors.password || ''"
        />
      </div>
      <div class="checkbox-wrap">
        <div class="remember">
          <div
            class="remind_box remind"
            v-if="!isMemory"
            @click="isMemory = true"
          ></div>
          <div class="remind_tick remind" v-else @click="isMemory = false">
            <div></div>
          </div>
          <!-- <img
            src="@/assets/images/form/remind_tick.png"
            v-else
            @click="m_Checked = false"
          /> -->
          <label for="memoryAc">{{ $t("login.memoryAccount") }}</label>
        </div>

        <!-- <input
          type="checkbox"
          id="memoryAc"
          v-model="isMemory"
          true-value="save"
          false-value="unsave"
          class="checkbox"
        /> -->
        <div class="forget" @click="forget">{{ $t("login.forgotPwd") }}</div>
      </div>
      <button type="submit" class="button submit">
        {{
          // $t("register.registerPage")
          $t("login.submit")
        }}
      </button>
      <!-- <baseButton class="button submit" type="submit">{{
        // $t("register.registerPage")
        $t("login.submit")
      }}</baseButton> -->
    </form>
  </div>
</template>

<script setup>
import BaseInput from "@/components/form/baseInput.vue";
import { useField, useForm } from "vee-validate";
import { object } from "yup";
import { storeToRefs } from "pinia";
import { getAccount, getMemoryAc } from "@/utils/cookie";
import { loginAcValidate, passwordValidate } from "@/utils/validate";
import throttle from "@/utils/throttle";
import { useRouter } from "vue-router";
import { useStore } from "@/store/index";
import { ref } from "vue";
import { usectrlLogin } from "@/store/ctrlLogin";
import { usepopoutNotice } from "@/store/popoutNotice";
const { countDownWidth } = storeToRefs(usepopoutNotice());
const { changeloginpageStatus } = usectrlLogin();
const router = useRouter();

const { useAuth, useMessage } = useStore();
const { openMsg } = useMessage();

const { login } = useAuth();
const isMemory = ref(getMemoryAc());
const storageAc = getAccount();

const validationSchema = object({
  account: loginAcValidate,
  password: passwordValidate,
});

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    account: storageAc || "",
  },
});

const { value: account } = useField("account");
const { value: password } = useField("password");

// 待優化
const loginHandler = () => {
  handleSubmit(async (values) => {
    if (countDownWidth.value > 0) {
      return;
    }
    const loginRes = await login({
      account: values.account,
      password: values.password,
      memoryAc: isMemory.value,
    });
    if (countDownWidth.value > 0) {
      password.value = "";
    }
    if (loginRes.data.code === 0) {
      router.push("/home");
      // usectrlLogin().$patch({
      //   loginpageStatus: false,
      // });
      changeloginpageStatus(false);
    }
  })();
};

const throttleLoginHanlder = throttle(loginHandler, 1500, true);

const forget = () => {
  openMsg({
    slot: `<div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAKUUExURQAAABR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14RR14f///7DR9TWI5VWc6TGG5fz9/yiB5E2X6Bp54urz/Bd34Rl44tjo+lKZ6RV24R164myo7Pj7/t/s+1+h6yyD5Iq68Ojy/MDa9/f6/mSk64688UeT6EOR5ziK5tnp+qvO9H2z7szh+W6r7dXm+trp+rjV9lCY6SqC5Gim7CeA493r+5C+8YK17/n7/tDj+dTm+TyN5iN+4/T5/n+077PS9ZvF8pnD8nOt7XGs7S+F5eHt+1ie6ubw/Ie58ODt+8Hb9zmL5jaJ5UqV6D+P58bd+Fuf6jeK5fb6/u71/dbn+r7Z97rW9jKH5ZK/8dvq+vP4/aXK8+/2/ZTA8evz/LTT9ZjC8pXB8qPJ86fL9Nzq+8vh+M3i+afM9EmU6GKj64W474S27yF9467P9fn8/v7+/3iw7kWS5yaA4/L3/fD2/Wal68nf+CV/46HI8+Tv/Iy88LzX9rbU9mmn7KrN9Mfe+F2g6nWu7XCr7aTJ88Pc93au7Xmx7mGi65rD8nqx7tPl+fr8/mqn7MLb9+Lu+5/H87LStQcAAABWdFJOUwDgKvo3/RjvAfAULHP1I/LP/qGSGyfj6waWq5XiHW/MY2z5PsfeVY6qXqAP57/X+wj0H5skmcl4MrQWkLPZ3Io7RUhnxSJrnRFYu0Pl0oPAUKaledOu9/ZiHQAAB0xJREFUaN7NWvdD1UYcDwo+EKwouAFX62xttbj3qKN7Ju+xkb2XigtcoIgIIogiQ6RYUF/de6G4t9ZRW/+Z5i6X5C65y8sbpf38dN/ke/dJbnzH3XGcSQQvDAiaM9zL0pPnR1m8ps0JCls4i/MkBoSN+5inIGTC+GCPEPh6j/XiDTB3/gx3KXpNn8c7xKSA3m5Q+E8YxZtCn6kDXKUY2o83DZ8fXaHpvcyHdwqfDnO203yXWninYRnh6wxH+BLeJXwyxTzHiMm8i+g73iTFZ/15NzB1sBmO0EDeLUzr5Zhjxte8m/Dyd8Qxui/vNizexhxf9eE9gL6jjTi8PcLB834G/xI+iPcQLMxxCQ7hPYaPGDZmcCDvQSyhr5chhpUiU0627BRkdJS2V+4wZhlC4xhjUCGjvOGqoENp5iojlhV6jg/8mNq2E6lqyyWdnX+qkjXGYPB11tKXbXcvRkkNplm35V6PjC4ry7DFvGvLRn23i/03X2ot/1KWZkEpbGvfvQLNi9u5VommlsmiMcmzWNakHLazNpfej/Yr4G3DJUblQRMJks/pWkmXQSMbcpnfuucEUKhuYryeTcQMdH+++S1oIhN7Eh15bm9EfWSs+qRog6hy5QmdpOcXGMk4+mfeBcOdL4s7rq05lQonwdW47Lwi+XH8c/DoKZ2lv8rRgxr7FB8TKz9YiTruWZdmleyrLUaKhUD8gx7ChCskVH8b+7dY9T0S1m3Rr0Vh5z30BZuA9IrKEqTEotQ4EXx5hVTc/0KgIy0CY/mV1srk5YhkOu3t72K1y1LxYZTARK0601dTf2UkWuy0mDpRrLVeKmYKRmiXlMBcz6ORfIPcIeVVfIcgREXD4lHBGGelGmCW2Ggskvsay+isFFjaJjjCUagXI5a6aCTfQhJKjhMt1jgDSxGCY0gG4YFYSqSQBMJcjfJit1hhPyhcSjVBIsB+zVBHkUA/4IjD9M+TxaZbYWmjGQ7hBdRdI5byKSxjRJKh+sfvRHXoXOsFc4DLxaaMj94PU/La+/KIrDdJsg9qPxaEu7TUVYyDdF7qYp1YrVCeMebQCNRzxUJCW2OStsWJ3CLyQRMahYNAaFVb2fCyftNhrNWEp/UPs1XxNLR2OdJv3dKQLOACCPkVChKy4NRSzUkD/Lw2Ra5TVhNCJJB3IcFOkizmhuHiebnOSXKNlJTxxBg1J0vyakXjGrTVsvSaIJnPzcSkVUqdStJoHUYK8vLfiORaRQPa0oOKmIKTjOOGY9JbRQmGU+oYWJHCSyQ/QvIbRWM7XF9qiHkDT1dxo4JNJuAbVsYpYhbSkNdmDZLVzzgUS34lbpEncVjgeFZR6QR9vgebTHkaQyYFF3tVhagMtMBkd4aRDOQwr6i62GpyhICPPBAfXYjJdlt8cTmucED2Kgh4SsRhQom6CoB4gFxvWTkambSdMFptd0yiarTAaCVKcALQwz9nkGDddUXROAK9Y5wTHKk3ZENMI/GjjcmheCCXOkFSk0QOvEAMPDaFT2qsxFknSLo0FqCGmMLYYryu1kknrIQJ3IGxszqKFzCS7wizUqfovJcdqllAO/JEEZtjCbOCG8hoJTHcAuUWotfb/sKkU5mPCZLNQP+1Iu4lDSRh6ovIGZmHtdIhRgsVitQqfukp7G02rH5EFrdpTD3ptBI7kdobmFbjPwJdgRTab6nCvYcgx0I2WSrUOi2N+81AieBvMGC3Yu2sk2LvSvvWRildwSxAgpTBSsKZGJ371QUS+fa3WVnbW+HiKsa7ncxA0ndir87BR9WCkHPfHqF18fPoIdHKeCW9xlnq1AS46RH+wqrYaFqSMoEe3GFYS8wha6M4i2JtKceJp4ekXChBLNGaWMwIU1WU3STXQ05aS412jRQoiVAVrYlQEAwbb0DtKHG0Ds9LXdyJ7KoWPzNTBwwHO4w5NklqVjlYo6cO3g52rvYYWeNmtLaBndvKs5MgX4dHJBVMjoZINO9BkMkbpHP0xJRAEf1nbspLu6lEdg+sxJSRYpN4lqCn2LoZvdzfKXsH/fHNcsPNAi3S1xDuuKvythKvNetson6zgPM3d+STnHih/fiRYwnWivJbWKJbJTAHnfdRtz1opoWJWM1qhcHDPd7hBg5rK4qJAvuu3VJ6mHJMiekdbUWxNtUYyEP5e9ItaNriElmKQea2B2molBOINClruM2b2x7kRprnSCbi1YR0tuYI81u2WuTjFFUGirotWy7czyyJGojfKTI8eZji3DY6idNyRmystsL5AwF8O5jw7MxjOvrRn+mjjesgC66OMNT5kHEUGDzQc8cnIb3/y+Om7jk4654jwO45zPTEsWyI///jgFlcL0PcoOg3drDJE/kxLg/MoO+74fpCqFMXMUb6uTCrnLuIAYKxf/9KifOXY35w+Q6O6Ws+y3q4c2HpJxMXlua6dWEJToEFsw2vXs2b7815BAPCfqFfIus/PpTzJIIXBQybGRhiEeecj8Vr+JyggIW9zNb9B3t1t3cz9CKEAAAAAElFTkSuQmCC"/></div><p style="font-size: 1.2rem">
      Por favor, entre em contato com o Centro de Suporte se você esqueceu sua senha
      </p>`,
    hasBtn: false,
    isContectService: true,
    titleBar: false,
  });
};
</script>
<style lang="scss" scoped>
.remember {
  height: 30%;
  margin-top: 10px;
  display: flex;
  align-items: center;
  object-fit: contain;
  img {
    height: 90%;
    object-fit: contain;
    margin-right: 2.5px;
  }
  .remind {
    width: 1.2rem;
    height: 1.2rem;
    border: 2px solid $modal-key;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remind_box {
    // margin-right: 5px;
  }
  .remind_tick {
    > div {
      width: 70%;
      height: 70%;
      background: $confirm-btn-bg;
    }
  }
  label {
    user-select: none;
    font-weight: bolder;
    //vmin 他會隨著從螢幕的寬度、高度，兩者之間取較小的那個當作參考單位
    font-size: 0.8rem;
    white-space: nowrap; //文字不換行
    margin-left: 8px;
  }
}
</style>
