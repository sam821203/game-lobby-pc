<template>
  <div class="vip" v-if="playerLevel !== null">
    <div class="level-wrap">
      <div class="title">{{ $t("activityList.VIP") }}</div>
      <p class="current-level">
        {{ $t("vip.curLevel") }}：VIP{{ playerLevel }}
      </p>
      <div class="level-list">
        <swiper
          :modules="modules"
          observer
          class="mySwiper"
          @slideChange="onSlideChange"
          @swiper="onSwiper"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
        >
          <swiper-slide>
            <div class="icon-wrap">
              <p>VIP0</p>
            </div>

            <ul>
              <li>{{ $t("vip.levelUp") }} : -</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul>
          </swiper-slide>
          <swiper-slide>
            <div class="icon-wrap">
              <p>VIP1</p>
            </div>
            <ul>
              <li>{{ $t("vip.levelUp") }} : 1</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul>
          </swiper-slide>
          <swiper-slide
            ><div class="icon-wrap">
              <p>VIP2</p>
            </div>
            <ul>
              <li>{{ $t("vip.levelUp") }} : 8</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul></swiper-slide
          >
          <swiper-slide
            ><div class="icon-wrap">
              <p>VIP3</p>
            </div>
            <ul>
              <li>{{ $t("vip.levelUp") }} : 38</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul></swiper-slide
          >
          <swiper-slide
            ><div class="icon-wrap">
              <p>VIP4</p>
            </div>
            <ul>
              <li>{{ $t("vip.levelUp") }} : 188</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul></swiper-slide
          >
          <swiper-slide
            ><div class="icon-wrap">
              <p>VIP5</p>
            </div>
            <ul>
              <li>{{ $t("vip.levelUp") }} : 688</li>
              <li>{{ $t("vip.dailyWithdraw") }} : ∞</li>
              <li>{{ $t("vip.withdrawLimit") }} : ∞</li>
            </ul></swiper-slide
          >
        </swiper>
        <div
          :class="['swiper-button-prev', { disablePrev: lower === 0 }]"
          @click="prev"
        >
          <p>VIP{{ lower - 1 }}</p>
        </div>
        <div
          :class="['swiper-button-next', { disableNext: upper === 6 }]"
          @click="next"
        >
          <p>VIP{{ upper }}</p>
        </div>
      </div>
    </div>
    <div class="ratio-wrap">
      <div class="title">
        {{ lower !== 5 ? `VIP ${lower}&rarr;VIP ${upper}` : "VIP5" }}
      </div>
      <div class="demo-progress" v-if="upper !== 6">
        <!-- LV.0 to 1 -->
        <div class="item-wrap" v-if="lower === 0">
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerCharge / 100) * 100) >= 100
                  ? 100
                  : Math.floor((playerCharge / 100) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.totalDeposit") }} : 100</p>
          </div>
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerFlow / 500) * 100) >= 100
                  ? 100
                  : Math.floor((playerFlow / 500) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.validBets") }} : 500</p>
          </div>
        </div>

        <!-- LV.1 to 2-->
        <div class="item-wrap" v-if="lower === 1">
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerCharge / 1000) * 100) >= 100
                  ? 100
                  : Math.floor((playerCharge / 1000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.totalDeposit") }} : 1,000</p>
          </div>
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerFlow / 10000) * 100) >= 100
                  ? 100
                  : Math.floor((playerFlow / 10000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.validBets") }} : 10,000</p>
          </div>
        </div>

        <!-- LV.2 to 3-->
        <div class="item-wrap" v-if="lower === 2">
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerCharge / 5000) * 100) >= 100
                  ? 100
                  : Math.floor((playerCharge / 5000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.totalDeposit") }} : 5,000</p>
          </div>
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerFlow / 50000) * 100) >= 100
                  ? 100
                  : Math.floor((playerFlow / 50000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.validBets") }} : 50,000</p>
          </div>
        </div>
        <!-- LV.3 to 4-->
        <div class="item-wrap" v-if="lower === 3">
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerCharge / 15000) * 100) >= 100
                  ? 100
                  : Math.floor((playerCharge / 15000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.totalDeposit") }} : 15,000</p>
          </div>
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerFlow / 150000) * 100) >= 100
                  ? 100
                  : Math.floor((playerFlow / 150000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.validBets") }} : 150,000</p>
          </div>
        </div>
        <!-- LV.4 to 5-->
        <div class="item-wrap" v-if="lower === 4">
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerCharge / 50000) * 100) >= 100
                  ? 100
                  : Math.floor((playerCharge / 50000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.totalDeposit") }} : 50,000</p>
          </div>
          <div class="item">
            <el-progress
              type="circle"
              :percentage="
                Math.floor((playerFlow / 500000) * 100) >= 100
                  ? 100
                  : Math.floor((playerFlow / 500000) * 100)
              "
              color="#fd8c55"
            />
            <p>{{ $t("vip.validBets") }} : 500,000</p>
          </div>
        </div>
      </div>
      <div class="level-limit" v-else>
        <p>{{ $t("vip.maximum") }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { SwiperSlide, Swiper } from "swiper/vue";
import { Navigation } from "swiper";
import { vipApi } from "@/api/info";
import "swiper/css";
import "swiper/css/navigation";
const modules = [Navigation];
const playerLevel = ref(null); // 玩家等級
const lower = ref(null);
const upper = ref(null);
const playerCharge = ref(null); //總存款
const playerFlow = ref(null); // 總流水
const playerTotalFriends = ref(null); // 總好友數
const vip1Friends = ref(null);
const vip2Friends = ref(null);
const vip3Friends = ref(null);

const getVip = async () => {
  const vipRes = await vipApi();
  playerLevel.value = vipRes.data.data.level;
  playerCharge.value = vipRes.data.data.charge / 10000;
  playerFlow.value = vipRes.data.data.flow / 10000;
  playerTotalFriends.value = vipRes.data.data.total_friends;
  const vipFriends = Object.values(vipRes.data.data.vip_n_friends_count);
  vip1Friends.value = vipFriends.slice(1).reduce((acc, cur) => acc + cur);
  vip2Friends.value = vipFriends.slice(2).reduce((acc, cur) => acc + cur);
  vip3Friends.value = vipFriends.slice(3).reduce((acc, cur) => acc + cur);
  console.log(vipRes);
};
getVip();

// 滑動切換等級
const onSlideChange = (swiper) => {
  if (swiper.activeIndex <= 5) {
    lower.value = swiper.activeIndex;
    upper.value = swiper.activeIndex + 1;
  }
};

// 顯示玩家當前等級
const onSwiper = (swiper) => {
  swiper.activeIndex = playerLevel.value;
  lower.value = playerLevel.value;
  upper.value = playerLevel.value + 1;
};
</script>
<style lang="scss" scoped>
.vip {
  // color: rgb(49, 79, 118);
  height: 100%;
  overflow: scroll;
  .level-wrap {
    .title {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: rgb(100, 240, 253);
      background-color: rgb(99, 129, 161);
    }
    .current-level {
      text-align: center;
      margin: 2%;
      font-weight: 600;
      // color: #000;
    }
    .level-list {
      height: 30vh;
      position: relative;
      .swiper {
        width: 100%;
        height: 100%;
        .swiper-slide {
          text-align: center;
          font-size: 18px;
          display: flex;
          align-items: flex-start;
          .icon-wrap {
            display: flex;
            flex-direction: column;
            width: 25%;
            align-items: center;
            margin-top: 10%;
            padding-left: 5% p {
              display: inline-block;
              color: #dc2916;
              font-size: 1.5rem;
              font-weight: 600;
            }
          }
          ul {
            width: 100%;
            text-align: justify;
            line-height: 1.5;
            font-size: 1.2rem;
            margin-left: 2rem;
            color: rgb(99, 129, 161);
            li {
              list-style-type: disc;
            }
          }
        }

        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .swiper-button-next,
      .swiper-button-prev {
        margin-top: 18%;
        background-size: 100% 100%;
        color: #fff;
        width: 20%;
        height: 15%;
      }
      .swiper-button-prev {
        flex-direction: row-reverse;
        background-image: url("@/assets/images/modal/vip_button_L.png");
        &::after {
          content: "";
        }
        p {
          padding-left: 20%;
        }
      }
      .swiper-button-next {
        background-image: url("@/assets/images/modal/vip_button_R.png");
        &::after {
          content: "";
        }
        p {
          padding-right: 20%;
        }
      }
      .disablePrev {
        display: none;
      }
      .disableNext {
        display: none;
      }
    }
  }
  .ratio-wrap {
    .title {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: rgb(100, 240, 253);
      background-color: rgb(99, 129, 161);
    }
    .demo-progress {
      .item-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-top: 5%;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 5%;
          // color: #000;
          text-align: center;
          font-size: 0.8rem;
          width: 45%;
          p {
            font-weight: 700;
            width: 120%;
          }
        }
        .el-progress {
          margin-bottom: 6%;
          height: 100px;
          width: 100px;
          display: flex;
          align-items: baseline;
          // color: white;
          :deep(span) {
            color: white;
          }
        }
      }
    }
  }
  .level-limit {
    height: 6rem;
    line-height: 6rem;
    font-size: 2rem;
    font-weight: 500;
    color: lightgray;
    text-align: center;
    margin-top: 15%;
  }
}
</style>
