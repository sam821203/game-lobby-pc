<template>
  <div class="leaderBoardWrap">
    <div class="leftLB">
      <div class="leftBoardName">
        <span class="left">Melhor Jogador</span>
        <span class="right">Ranking mensal</span>
      </div>
      <div class="scroll">
        <div class="top3">
          <template v-for="(v, k) in flowData" :key="k">
            <div
              :class="[
                'rankContent',
                `rankContent${v.top_n}`,
                { list: v.top_n > 3 },
              ]"
              v-if="k < 3"
            >
              <div
                :class="['first', { odd: k % 2 === 0 }, { even: k % 2 !== 0 }]"
              >
                <div :class="['rank', { topRank: v.top_n < 4 }]">
                  <img
                    :src="
                      require(`@/assets/images/leaderBoard/award/rank_n${v.top_n}.png`)
                    "
                  />
                </div>
                <span
                  v-sliceAccount:[3]="v.account"
                  v-if="v.nickname !== userInfo.nickname"
                  class="acc"
                ></span>
                <span v-else>{{ v.account }}</span>
                <div class="vipWrap">
                  <img
                    src="@/assets/images/lobby/vip_icon.png"
                    alt="vip"
                    class="vip"
                  />
                  <span>VIP1</span>
                </div>
                <span class="score">
                  {{ (v.socre / 10000).toFixed(2) }}
                </span>
              </div>
            </div>
          </template>
        </div>
        <template v-for="(v, k) in flowData" :key="k">
          <div
            :class="[
              'rankContent',
              `rankContent${v.top_n}`,
              { list: v.top_n > 3 },
            ]"
            v-if="k >= 3"
          >
            <div
              :class="['first', { odd: k % 2 === 0 }, { even: k % 2 !== 0 }]"
            >
              <div :class="['rank', { topRank: v.top_n < 4 }]">
                <span>{{ v.top_n }}</span>
              </div>
              <span
                v-sliceAccount:[3]="v.account"
                v-if="v.nickname !== userInfo.nickname"
                class="acc"
              ></span>
              <span v-else>{{ v.account }}</span>
              <div class="vipWrap">
                <img
                  src="@/assets/images/lobby/vip_icon.png"
                  alt="vip"
                  class="vip"
                />
                <span>VIP1</span>
              </div>
              <span class="score">
                {{ (v.socre / 10000).toFixed(2) }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="rightLB">
      <div class="rightBoardName">
        <span class="left">Melhor Amigo</span>
        <span class="right">Ranking semanal</span>
      </div>
      <div class="scroll">
        <div class="top3">
          <template v-for="(v, k) in inviteData" :key="k">
            <div
              :class="[
                'rankContent',
                `rankContent${v.top_n}`,
                { list: v.top_n > 3 },
              ]"
              :key="k"
              v-if="k < 3"
            >
              <div
                :class="['first', { odd: k % 2 === 0 }, { even: k % 2 !== 0 }]"
              >
                <div :class="['rank', { topRank: v.top_n < 4 }]">
                  <img
                    :src="
                      require(`@/assets/images/leaderBoard/award/rank_n${v.top_n}.png`)
                    "
                    v-if="v.top_n < 4"
                  />
                  <span v-else>{{ v.top_n }}</span>
                </div>
                <span
                  v-sliceAccount:[3]="v.account"
                  v-if="v.nickname !== userInfo.nickname"
                  class="acc"
                ></span>
                <span v-else>{{ v.account }}</span>
                <div class="vipWrap">
                  <img
                    src="@/assets/images/lobby/vip_icon.png"
                    alt="vip"
                    class="vip"
                  />
                  <span>VIP1</span>
                </div>
                <span class="score">
                  {{ (v.socre / 10000).toFixed(2) }}
                </span>
              </div>
            </div>
          </template>
        </div>
        <template v-for="(v, k) in inviteData" :key="k">
          <div
            :class="[
              'rankContent',
              `rankContent${v.top_n}`,
              { list: v.top_n > 3 },
            ]"
            :key="k"
            v-if="k >= 3"
          >
            <div
              :class="['first', { odd: k % 2 === 0 }, { even: k % 2 !== 0 }]"
            >
              <div :class="['rank', { topRank: v.top_n < 4 }]">
                <img
                  :src="
                    require(`@/assets/images/leaderBoard/award/rank_n${v.top_n}.png`)
                  "
                  v-if="v.top_n < 4"
                />
                <span v-else>{{ v.top_n }}</span>
              </div>
              <span
                v-sliceAccount:[3]="v.account"
                v-if="v.nickname !== userInfo.nickname"
                class="acc"
              ></span>
              <span v-else>{{ v.account }}</span>
              <div class="vipWrap">
                <img
                  src="@/assets/images/lobby/vip_icon.png"
                  alt="vip"
                  class="vip"
                />
                <span>VIP1</span>
              </div>
              <span class="score">
                {{ (v.socre / 10000).toFixed(2) }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { leaderBoardApi } from "@/api/info";
import { getNormalUser } from "@/utils/cookie";
import { storeToRefs } from "pinia";

import { useStore } from "@/store";
const { useAuth } = useStore();
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
const inviteData = ref([]);
const personalData = ref([]);
const flowData = ref([]);
const getInviteData = async () => {
  const { data } = await leaderBoardApi(
    "invite",
    getNormalUser() ? JSON.parse(getNormalUser()).user_id : ""
  );
  personalData.value = data.data.caller_rank;
  inviteData.value = data.data.rank;
  console.log(inviteData.value);
};

const getFlowData = async () => {
  const { data } = await leaderBoardApi(
    "flow",
    getNormalUser() ? JSON.parse(getNormalUser()).user_id : ""
  );
  personalData.value = data.data.caller_rank;
  flowData.value = data.data.rank;
  console.log(flowData.value);
};

onMounted(() => {
  getInviteData();
  getFlowData();
});
</script>

<style lang="scss" scoped>
.leaderBoardWrap {
  // background: red;
  display: flex;
  text-align: center;
  padding: 10px;
  .leftLB,
  .rightLB {
    margin-left: 5px;
    margin-right: 5px;
    position: relative;
    width: calc(100% - 10px);
    // background-image: url("@/assets/images/leaderBoard/flat2.png");
    // background-size: 100% 100%;

    .leftBoardName,
    .rightBoardName {
      width: calc(100%);
      margin: 0 auto;
      padding: 0 2rem;
      // height: 4rem;
      display: flex;
      justify-content: space-between;
      align-items: end;
      border-radius: 20px 20px 0 0;
      background: rgb(73, 56, 96);
      background: linear-gradient(
        90deg,
        rgba(73, 56, 96, 1) 0%,
        rgba(40, 32, 48, 1) 100%
      );
      // @include breakpoint-up("xs") {
      //   height: 1rem;
      // }
      @include breakpoint-up("sm") {
        height: 2rem;
      }
      @include breakpoint-up("md") {
        height: 2.5rem;
      }
      @include breakpoint-up("lg") {
        height: 3rem;
      }
      @include breakpoint-up("xl") {
        height: 3.5rem;
      }
      @include breakpoint-up("xxl") {
        height: 4rem;
      }
      .left {
        height: 100%;
        font-size: 1.5rem;
        color: #af41ca;
        font-weight: 600;
        display: flex;
        align-items: center;
        // @include breakpoint-up("xs") {
        //   font-size: 1.5rem;
        // }
        @include breakpoint-up("sm") {
          font-size: 1rem;
        }
        @include breakpoint-up("md") {
          font-size: 1.2rem;
        }
        @include breakpoint-up("lg") {
          font-size: 1.4rem;
        }
        @include breakpoint-up("xl") {
          font-size: 1.5rem;
        }
        @include breakpoint-up("xxl") {
          font-size: 1.8rem;
        }
      }
      .right {
        height: 100%;
        display: flex;
        align-items: center;
        color: #a6a6a6;
      }
    }
    .scroll {
      height: 540px;
      padding-bottom: 1rem;
      overflow-y: auto;
      // @include breakpoint-up("lg") {
      //   margin-top: 60%;
      //   font-size: 0.8rem;
      // }
      // @include breakpoint-up("xl") {
      //   margin-top: 50%;
      //   font-size: 1rem;
      // }
      // @include breakpoint-up("xxl") {
      //   margin-top: 45%;
      //   font-size: 1rem;
      // }
      .top3 {
        height: 200px;
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    .rankContent {
      color: #5a5a5a;
      position: relative;
    }
    .rankContent1,
    .rankContent2,
    .rankContent3 {
      background-image: url("@/assets/images/leaderBoard/ranking_box.png");
      background-size: 100% 100%;
      width: 122px;
      height: 158px;
      @include breakpoint-up("xs") {
        width: 92px;
        height: 119px;
      }
      @include breakpoint-up("lg") {
        width: 122px;
        height: 158px;
      }
      @include breakpoint-up("xl") {
        width: 122px;
        height: 158px;
      }
      @include breakpoint-up("xxl") {
        width: 122px;
        height: 158px;
      }
      .first {
        .topRank {
          img {
            width: 30%;
            position: absolute;
            left: -8%;
            top: -8%;
          }
        }
        .acc {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 45%;
          color: #fff;
        }
        .vipWrap {
          position: absolute;
          bottom: 33%;
          display: flex;
          justify-content: space-evenly;
          align-items: baseline;
          width: 55%;
          left: 50%;
          transform: translate(-50%);
          .vip {
            width: 20px;
          }
          span {
            @include breakpoint-up("md") {
              font-size: 12px;
            }
            @include breakpoint-up("xxl") {
              font-size: 15px;
            }
            color: red;
          }
        }
        .score {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 20%;
        }
      }
    }
    .rankContent1 {
      position: absolute;
      top: calc(50%);
      transform: translateY(-50%);
      // top: 13%;
      // left: 50%;
      // transform: translateX(-50%);
      .first {
        .score {
          color: yellow;
          font-weight: 600;
        }
      }
    }
    .rankContent2 {
      // position: absolute;
      // left: 10%;
      // top: 18%;
      margin-right: 61px;
      margin-top: 2rem;
      .first {
        .score {
          color: lightgray;
          font-weight: 600;
        }
      }
    }
    .rankContent3 {
      // position: absolute;
      // right: 10%;
      // top: 18%;
      margin-left: 61px;
      margin-top: 2rem;
      .first {
        .score {
          color: darkorange;
          font-weight: 600;
        }
      }
    }
    .rankContent5 {
      .first {
        .rank {
          color: #e5e5e5;
        }
      }
    }
    .rankContent6 {
      .first {
        .rank {
          color: #cccccc;
        }
      }
    }

    .rankContent7 {
      .first {
        .rank {
          color: #a6a6a6;
        }
      }
    }
    .rankContent8 {
      .first {
        .rank {
          color: #858585;
        }
      }
    }
    .rankContent9 {
      .first {
        .rank {
          color: #808080;
        }
      }
    }
    .rankContent10 {
      .first {
        .rank {
          color: #5a5a5a;
        }
      }
    }

    .list {
      height: 45px;
      .first {
        width: 90%;
        margin: 0 auto 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-radius: 10px;
        padding: 2.2%;

        .acc {
          margin-left: -30%;
          color: #fff;
        }
        .vipWrap {
          position: absolute;
          left: 3%;
          width: 30%;
          .vip {
            width: 12%;
          }
          span {
            margin-left: 2%;
            color: red;
          }
        }
        .score {
          color: yellow;
        }
      }
      .even {
        background: black;
      }
    }
  }
}
</style>
