<template>
  <!-- 紅利狀態 -->
  <!-- <div class="stateGroup">
    <div
      :class="[
        'option',
        { child: index > 0 },
        { selected: selected === option.id },
      ]"
      v-for="(option, index) in optionList"
      :key="index"
      @click="selectState(option.id)"
    >
      {{ $t(option.option) }}
    </div>
  </div> -->
  <BaseHeader
    :content="'activityList.awardCenter'"
    :imgSrc="'activityList/promotions_1'"
  />
  <BaseTabFilter
    :showStatus="showStatus"
    :curStatus="curStatus"
    :statusList="statusList"
    :optionList="optionList"
    @selectStateFunc="selectState"
    v-if="showList"
  >
  </BaseTabFilter>
  <div class="noData" v-else>{{ $t("No Data") }}</div>

  <!-- 紅利細節 -->
  <!-- <div
    class="bonus-section"
    @click="openBonusDetail(index)"
    v-for="(bonus, index) in showList"
    :key="index"
  >
    <div class="top__content">
      <p>{{ bonus.name }}</p>
      <div class="bonus__content">
        <span>{{ $t("Bonus") }}</span>
        <span>R$ {{ bonus.bonus / 10000 }} </span>
      </div>
    </div>
    <div
      :class="['down__content', { open__content: bonusDetail === index }]"
    >
      <div
        class="claim-deadline"
        v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
      >
        <span>{{ $t("Claim Deadline") }}: </span
        ><span :class="[{ red: bonus.smallThanOneDay }]">{{
          bonus.countDownTime
        }}</span>
      </div>
      <div class="claim-deadline" v-else></div>
      <div v-if="bonusDetail === index">
        <div class="line">
          <span>{{ $t("completion Deadline") }}: </span
          ><span v-time="bonus.achieve_time"></span>
        </div>
        <div class="line">
          <span>{{ $t("Redeem Threshold") }}: </span
          ><span>{{ bonus.threshold / 10000 }}</span>
        </div>
        <div class="line">
          <span>{{ $t("Post-Redeem Threshold") }}: </span
          ><span>{{ (userRedeem + bonus.threshold) / 10000 }}</span>
        </div>
        <button
          class="claim"
          @click.prevent="claim(bonus.id, bonus.type)"
          v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
        >
          {{ $t("CLAIM") }}
        </button>
        <div class="blank" v-else></div>
        <p v-if="bonus.status === 3" class="similar">
          {{ $t("Already received similar bonuses") }}
        </p>
      </div>
      <div :class="['arrow', { openArrow: bonusDetail === index }]"></div>
    </div>

    <div
      :class="['stamp__expired', { openStamp: bonusDetail === index }]"
      v-if="
        bonus.status === 2 ||
        (bonus.countDownTime === '00:00:00' &&
          bonus.status !== 3 &&
          bonus.status !== 1)
      "
    >
      {{ $t("Expired") }}
    </div>
    <div
      :class="['stamp__claim', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 1"
    >
      {{ $t("Claimed") }}
    </div>
    <div
      :class="['stamp__cancel', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 3"
    >
      {{ $t("Canceled") }}
    </div>
  </div> -->

  <div class="bonus-section" v-for="(bonus, index) in showList" :key="index">
    <p>{{ bonus.name }}</p>

    <div class="bonus__content">
      <span>{{ $t("Bonus") }}</span>
      <span>R$ {{ bonus.bonus / 10000 }} </span>
    </div>

    <!-- 領取時限 -->
    <div
      class="claim-deadline"
      v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
    >
      <span>{{ $t("Claim Deadline") }}: </span
      ><span :class="[{ red: bonus.smallThanOneDay }]">{{
        bonus.countDownTime
      }}</span>
    </div>
    <div class="claim-deadline" v-else></div>

    <ul class="bottom__content">
      <li>
        <div>{{ $t("completion Deadline") }}:</div>
        <div v-time="bonus.achieve_time"></div>
      </li>
      <li>
        <div>{{ $t("Redeem Threshold") }}:</div>
        <div>{{ bonus.threshold / 10000 }}</div>
      </li>
      <li>
        <div>{{ $t("Post-Redeem Threshold") }}:</div>
        <div>{{ (userRedeem + bonus.threshold) / 10000 }}</div>
      </li>
      <li>
        <!-- 領取狀態印章 -->
        <div class="stamp">
          <div
            :class="['stamp__expired', { openStamp: bonusDetail === index }]"
            v-if="
              bonus.status === 2 ||
              (bonus.countDownTime === '00:00:00' &&
                bonus.status !== 3 &&
                bonus.status !== 1)
            "
          >
            {{ $t("Expired") }}
          </div>
          <div
            :class="['stamp__claim', { openStamp: bonusDetail === index }]"
            v-if="bonus.status === 1"
          >
            {{ $t("Claimed") }}
          </div>
          <div
            :class="['stamp__cancel', { openStamp: bonusDetail === index }]"
            v-if="bonus.status === 3"
          >
            {{ $t("Canceled") }}
          </div>
        </div>
      </li>
      <button
        class="claim"
        @click.prevent="claim(bonus.id, bonus.type)"
        v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
      >
        {{ $t("CLAIM") }}
      </button>
      <div class="blank" v-else></div>
      <p v-if="bonus.status === 3" class="similar">
        {{ $t("Already received similar bonuses") }}
      </p>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
import { getBonusListApi, claimBonusApi } from "@/api/announcement.js";
import { getPlayerId } from "@/utils/cookie";
import { storeToRefs } from "pinia";
import { displayTimeLeft } from "@/utils/timer";

const { useMessage, useAuth } = useStore();
const authStore = useAuth();
import { useI18n } from "vue-i18n";
const { userInfo } = storeToRefs(authStore);
const userRedeem = ref(userInfo.value.wallets[0].cash_out_gateway);
const { openMsg } = useMessage();
const router = useRouter();
const selected = ref(4);
const bonusDetail = ref(-1);
const totalList = ref(null);
const showList = ref(null);
const curStatus = ref("全部");
const statusList = ref(true);
const { t } = useI18n();

const optionList = reactive([
  { option: t("activityList.all"), id: 4 },
  { option: t("activityList.available"), id: 0 },
  { option: t("activityList.received"), id: 1 },
  { option: t("activityList.expired"), id: 2 },
  { option: t("activityList.cancelled"), id: 3 },
]);

const showStatus = () => (statusList.value = !statusList.value);

// const openBonusDetail = (index) => {
//   if (bonusDetail.value === index) {
//     bonusDetail.value = -1;
//     open.value = -1;
//   } else {
//     bonusDetail.value = index;
//     open.value = index;
//   }
// };

const claim = (id, type) => {
  openMsg({
    content: "Você tem certeza de que deseja resgatar o bônus da atividade?",
    hasCancel: true,
  }).then(() => {
    claimBonus(id, type);
  });
};

const claimBonus = async (id, type) => {
  const claimRes = await claimBonusApi(id, type);
  if (claimRes.data.code === 0) {
    selectState(selected.value, curStatus.value);
    statusList.value = false;
  }
};

//取得列表，預設顯示全部 Bonus
const selectState = async (id, option) => {
  selected.value = id;
  curStatus.value = option;
  statusList.value = !statusList.value;
  bonusDetail.value = -1;
  if (getPlayerId() === undefined) {
    openMsg({ content: "請先登入 / 註冊" }).then(() => {
      router.push("/home");
    });
    return;
  } else {
    const bonusListRes = await getBonusListApi(userInfo.value.account);
    totalList.value = bonusListRes.data.data.data;
    if (id === 4) {
      showList.value = totalList.value;
    } else {
      showList.value = totalList.value.filter((item) => item.status === id);
    }
    if (id === 4 || id === 0) {
      for (let i in showList.value) {
        showList.value[i].countDownTime = "";
        showList.value[i].smallThanOneDay = false;
        showList.value[i].timeExpired = false;
        if (showList.value[i]?.status === 0) {
          countdown(i);
        }
      }
    }
  }
};
selectState(4, "全部");

let intervalTimer = ref({});
const countdown = (i) => {
  intervalTimer.value[i] = setInterval(() => {
    const deadline = new Date(showList.value[i]?.expire_time).getTime();
    const start = new Date().getTime();
    showList.value[i].countDownTime = deadline - start;
    // showList.value[i].countDownTime = deadline - start;
    console.log(showList.value[i]?.countDownTime);
    if (
      showList.value[i]?.countDownTime <= 0 ||
      showList.value[i]?.countDownTime === "00:00:00"
    ) {
      showList.value[i].countDownTime = "0";
      showList.value[i].timeExpired = true;
      clearInterval(intervalTimer.value[i]);
      // return;
    }
    if (showList.value[i]?.countDownTime > 86400000) {
      showList.value[i].countDownTime = `${Math.floor(
        showList.value[i].countDownTime / 86400000
      )} Dias`;
      clearInterval(intervalTimer.value[i]);
    } else {
      showList.value[i].smallThanOneDay = true;
      showList.value[i].countDownTime = displayTimeLeft(
        Math.floor(showList.value[i]?.countDownTime / 1000)
      );
    }
  }, 1000);
};

onBeforeUnmount(() => {
  for (let k in intervalTimer.value) {
    clearInterval(intervalTimer.value[k]);
  }
});
</script>

<style lang="scss">
.noData {
  text-align: center;
  margin-top: 30%;
  font-size: 1.5rem;
  color: gray;
}
.bonus-section {
  position: relative;
  width: 90%;
  margin: 0 auto;
  margin-top: 3%;
  .bonus__content {
    display: flex;
    justify-content: space-between;
    margin-top: 2%;
  }
  .bottom__content {
    display: flex;
    justify-content: space-between;
    li {
      width: 25%;
    }
  }
  .claim-deadline {
    .red {
      color: red;
    }
  }
  .claim-deadline {
    margin-bottom: 3%;
  }
  .claim {
    height: 2rem;
    width: 25%;
    color: white;
    border-radius: 10px;
    margin-left: 25%;
    background: #6b0285;
  }
  .blank {
    height: 1.2rem;
    width: 25%;
  }
  .similar {
    text-align: center;
    color: red;
    font-weight: 600;
    margin-top: -5%;
  }
}
.stamp__expired,
.stamp__claim,
.stamp__cancel {
  width: 35%;
  font-weight: 600;
  text-align: center;
  border-radius: 5px;
  padding: 2%;
  position: absolute;
  top: 50%;
  left: 6%;
  transform: rotate(-8deg);
}
.stamp__expired {
  color: #d43030;
  border: 2px solid #d43030;
}

.stamp__claim {
  color: #ff8d1a;
  border: 2px solid #ff8d1a;
}
.stamp__cancel {
  color: gray;
  border: 2px solid gray;
}
.openStamp {
  top: 25%;
}
</style>
