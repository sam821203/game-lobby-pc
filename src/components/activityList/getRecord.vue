<template>
  1231231312
  <Announcement />
  <MiddleBar />
  <BaseHeader
    :content="'activityList.awardCenter'"
    :imgSrc="'activityList/record'"
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
  <div class="no-data" v-else>{{ $t("No Data") }}</div>

  <!-- 紅利細節 -->
  <div class="bonus-section" v-for="(bonus, index) in showList" :key="index">
    <BaseCard>
      <p>{{ bonus.name }}</p>

      <div class="bonus__content">
        <!-- 領取時限 -->
        <div
          class="deadline"
          v-visibility="
            bonus.status === 0 && bonus.countDownTime !== '00:00:00'
          "
        >
          <span>{{ $t("Claim Deadline") }}: </span
          ><span
            :class="['mr-sm deadline__num', { warning: bonus.smallThanOneDay }]"
            >{{ bonus.countDownTime }}</span
          >
        </div>
        <span
          ><span class="tag">R$</span
          >{{ groupDigital(divideByNum(bonus.bonus)) }}
        </span>
      </div>

      <ul class="bottom__content">
        <li v-visibility="bonus.status === 0">
          <div>{{ $t("completion Deadline") }}:</div>
          <div v-timeWithMeridiem="bonus.achieve_time"></div>
        </li>
        <li v-visibility="bonus.status === 0">
          <div>{{ $t("Redeem Threshold") }}:</div>
          <div v-groupDigital="divideByNum(bonus.threshold)"></div>
        </li>
        <li v-visibility="bonus.status === 0">
          <div>{{ $t("Post-Redeem Threshold") }}:</div>
          <div v-groupDigital="divideByNum(userRedeem + bonus.threshold)"></div>
        </li>

        <!-- 領取狀態印章 -->
        <li>
          <div class="stamp">
            <div
              class="stamp__claim"
              @click.prevent="claim(bonus)"
              v-if="bonus.status === 0 && bonus.countDownTime !== '00:00:00'"
            >
              {{ $t("CLAIM") }}
            </div>
            <div
              class="stamp__expired"
              v-if="
                bonus.status === 2 ||
                (bonus.countDownTime === '00:00:00' &&
                  bonus.status !== 3 &&
                  bonus.status !== 1)
              "
            >
              {{ $t("Expired") }}
            </div>
            <div class="stamp__claimed" v-if="bonus.status === 1">
              {{ $t("Claimed") }}
            </div>
            <div class="stamp__cancel" v-if="bonus.status === 3">
              {{ $t("Canceled") }}
            </div>
          </div>
        </li>
      </ul>
    </BaseCard>
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

import Announcement from "@/views/home/components/announcement.vue";
import MiddleBar from "@/views/home/components/middleBar.vue";

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
const divideByNum = (num) => num / 10000;
const groupDigital = (num) => num.toLocaleString();

// const openBonusDetail = (index) => {
//   if (bonusDetail.value === index) {
//     bonusDetail.value = -1;
//     open.value = -1;
//   } else {
//     bonusDetail.value = index;
//     open.value = index;
//   }
// };

const claim = (bonus) => {
  openMsg({
    title: t("activityList.redeemBonus"),
    content: " ",
    contentList: [
      {
        id: 1,

        title: t("Redeem Threshold"),
        info: groupDigital(divideByNum(bonus.threshold)),
      },
      {
        id: 2,
        title: t("Post-Redeem Threshold"),
        info: groupDigital(divideByNum(userRedeem.value + bonus.threshold)),
      },
      {
        id: 3,
        title: t("activityList.activityBonus"),
        info: groupDigital(divideByNum(bonus.bonus)),
      },
    ],
    hasContentList: true,
  }).then(() => {
    claimBonus(bonus.id, bonus.type);
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
    if (
      showList.value[i]?.countDownTime <= 0 ||
      showList.value[i]?.countDownTime === "00:00:00"
    ) {
      showList.value[i].countDownTime = "0";
      showList.value[i].timeExpired = true;
      clearInterval(intervalTimer.value[i]);
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

<style lang="scss" scoped>
.header {
  margin-top: 32px;
  margin-left: 24px;
}
.no-data {
  text-align: center;
  margin-top: 30%;
  font-size: 1.5rem;
  color: gray;
}
.bonus-section {
  position: relative;
  width: 100%;
  padding: 0 24px;
  margin-bottom: 12px;
  color: $title2;
  .base {
    padding: 20px 20px 16px;
  }
  p {
    padding-left: 8px;
    margin-bottom: 12px;
    border-left: 3px solid $anotherservice-text-color;
  }
  .bonus__content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    span:first-child {
      font-size: 14px;
    }
    span:last-child {
      font-weight: 600;
      .tag {
        margin-right: 4px;
        color: $anotherservice-text-color;
      }
    }
  }
  .bottom__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    li {
      width: 25%;
      &:not(:last-child) {
        div {
          &:first-child {
            font-weight: 600;
          }
          &:last-child {
            font-size: 14px;
            letter-spacing: 0.2px;
          }
        }
      }
    }
  }
  .deadline {
    .mr-sm {
      margin-right: 4px;
    }
    .deadline__num {
      color: $func-button-color-default;
      &.warning {
        color: $error-color;
      }
    }
  }
  .deadline {
    font-weight: 600;
  }
  .blank {
    height: 1.2rem;
    width: 25%;
  }
  .similar {
    text-align: center;
    color: $error-color;
    font-weight: 600;
    margin-top: -5%;
  }
}
.stamp {
  width: 100%;
}
.stamp__claim,
.stamp__expired,
.stamp__claimed,
.stamp__cancel {
  height: 40px;
  font-weight: 600;
  line-height: 40px;
  text-align: center;
  border-radius: $border-radius-md;
}
.stamp__claim {
  color: $title2;
  background: $modal-key;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: $button-selected-bg-darken;
    filter: brightness(94%);
  }
}
.stamp__expired {
  color: $error-color;
  border: 3px solid $error-color;
  line-height: 36px;
  transform: rotate(8deg);
  transform-origin: 100% 0%;
}
.stamp__claimed {
  color: $title2;
  background: $disable-btn-color;
  cursor: not-allowed;
}
.stamp__cancel {
  color: $disable-btn-color;
  border: 3px solid $disable-btn-color;
  line-height: 36px;
  transform: rotate(8deg);
  transform-origin: 100% 0%;
}
</style>
