<template>
  <div
    class="bonus-section"
    @click="openBonusDetail(index)"
    v-for="(bonus, index) in showList"
    :key="index"
  >
    <div class="topContent">
      <p>{{ bonus.name }}</p>
      <div class="bonusContent">
        <span>{{ $t("Bonus") }}</span>
        <span>R$ {{ bonus.bonus / 10000 }} </span>
      </div>
    </div>
    <div :class="['downContent', { openDownContent: bonusDetail === index }]">
      <div
        class="claimDeadline"
        v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
      >
        <span>{{ $t("Claim Deadline") }}: </span
        ><span :class="[{ red: bonus.smallThanOneDay }]">{{
          bonus.countDownTime
        }}</span>
      </div>
      <div class="claimDeadline" v-else></div>
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

    <!-- 領取狀態印章 -->
    <div
      :class="['expiredStamp', { openStamp: bonusDetail === index }]"
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
      :class="['claimStamp', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 1"
    >
      {{ $t("Claimed") }}
    </div>
    <div
      :class="['cancelStamp', { openStamp: bonusDetail === index }]"
      v-if="bonus.status === 3"
    >
      {{ $t("Canceled") }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { useStore } from "@/store/index";
// const { useMessage } = useStore();
// const { openMsg } = useMessage();
// import { claimBonusApi } from "@/api/announcement.js";

defineProps({
  userRedeem: {
    type: Number,
    required: true,
  },
});

const bonusDetail = ref(-1);

const openBonusDetail = (index) => {
  if (bonusDetail.value === index) {
    bonusDetail.value = -1;
    open.value = -1;
  } else {
    bonusDetail.value = index;
    open.value = index;
  }
};

// const claim = (id, type) => {
//   openMsg({
//     content: "Você tem certeza de que deseja resgatar o bônus da atividade?",
//     hasCancel: true,
//   }).then(() => {
//     claimBonus(id, type);
//   });
// };

// const claimBonus = async (id, type) => {
//   const claimRes = await claimBonusApi(id, type);
//   if (claimRes.data.code === 0) {
//     selectState(selected.value, curStatus.value);
//     statusList.value = false;
//   }
// };
</script>

<style lang="scss" scoped>
.bonus-section {
  border: 1px solid gray;
  width: 90%;
  margin: 0 auto;
  border-radius: 15px;
  margin-top: 3%;
  position: relative;
  .topContent {
    background: #470c85;
    border-radius: 15px 15px 0 0;
    padding: 3%;
    .bonusContent {
      display: flex;
      justify-content: space-between;
      margin-top: 2%;
    }
  }
  .downContent {
    background: #18134c;
    border-radius: 0 0 15px 15px;
    padding: 3%;
    display: flex;
    justify-content: space-between;
    min-height: 2rem;
    .arrow {
      width: 12px;
      height: 12px;
      border: 1px solid gray;
      border-width: 1px 1px 0 0;
      transform: rotate(135deg);
      margin-bottom: 10px;
    }
    .line {
      margin-bottom: 3%;
    }
    .claimDeadline {
      .red {
        color: red;
      }
    }
  }
  .openDownContent {
    display: flex;
    flex-direction: column;
    position: relative;
    .claimDeadline {
      margin-bottom: 3%;
    }
    .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3%;
      border-bottom: 1px solid gray;
      padding-bottom: 1%;
    }
    .claim {
      height: 2rem;
      width: 45%;
      color: white;
      border-radius: 10px;
      margin-left: 25%;
      background: #6b0285;
    }
    .blank {
      height: 1.2rem;
      width: 45%;
    }
    .similar {
      text-align: center;
      color: red;
      font-weight: 600;
      margin-top: -5%;
    }
    .openArrow {
      position: absolute;
      bottom: 2%;
      right: 5%;
      transform: rotate(-45deg);
    }
  }
}
</style>
