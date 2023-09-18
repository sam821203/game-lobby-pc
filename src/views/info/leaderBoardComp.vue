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
                { lessThan3: v.top_n === 2 && flowData.length === 2 },
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
                  :class="['acc', { player: v.account === userInfo.account }]"
                  >{{ v.account }}</span
                >
                <!-- <div class="vipWrap">
                  <img
                    src="@/assets/images/lobby/vip_icon.png"
                    alt="vip"
                    class="vip"
                  />
                  <span>VIP1</span>
                </div> -->
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
                :class="['acc', { player: v.account === userInfo.account }]"
                >{{ v.account }}</span
              >
              <!-- <div class="vipWrap">
                <img
                  src="@/assets/images/lobby/vip_icon.png"
                  alt="vip"
                  class="vip"
                />
                <span>VIP1</span>
              </div> -->
              <span class="score">
                {{ (v.socre / 10000).toFixed(2) }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="rankContentBottom" v-if="flowPersonalData">
        <!-- &&getPlayerId() != undefined -->
        <div class="first">
          <!-- <span>{{ $t("board.myRanking") }}:</span> -->

          <span>{{
            flowPersonalData.top_n == -1 ? "-" : flowPersonalData.top_n
          }}</span>
        </div>
        <div class="second">
          {{ flowPersonalData.account }}
        </div>
        <div class="third">
          <!-- {{ personalData.top_n == -1 ? "-" : personalData.socre / 10000 }} -->
          {{ (flowPersonalData.socre / 10000).toFixed(2) }}
        </div>
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
                { lessThan3: v.top_n === 2 && inviteData.length === 2 },
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
                  :class="['acc', { player: v.account === userInfo.account }]"
                  >{{ v.account }}</span
                >
                <!-- <div class="vipWrap">
                  <img
                    src="@/assets/images/lobby/vip_icon.png"
                    alt="vip"
                    class="vip"
                  />
                  <span>VIP1</span>
                </div> -->
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
                :class="['acc', { player: v.account === userInfo.account }]"
                >{{ v.account }}</span
              >
              <!-- <div class="vipWrap">
                <img
                  src="@/assets/images/lobby/vip_icon.png"
                  alt="vip"
                  class="vip"
                />
                <span>VIP1</span>
              </div> -->
              <span class="score">
                {{ (v.socre / 10000).toFixed(2) }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="rankContentBottom" v-if="invitePersonalData">
        <!-- &&getPlayerId() != undefined -->
        <div class="first">
          <span>{{
            invitePersonalData.top_n == -1 ? "-" : invitePersonalData.top_n
          }}</span>
          <!-- <img src="@/assets/images/lobby/vip_icon.png" alt="vip" class="vip" />
          <span>VIP{{ invitePersonalData.top_n }}</span> -->
        </div>
        <div class="second">
          {{ invitePersonalData.account }}
        </div>
        <div class="third">
          <!-- {{ personalData.top_n == -1 ? "-" : personalData.socre / 10000 }} -->
          {{ (invitePersonalData.socre / 10000).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { leaderBoardApi } from "@/api/info";
import { getNormalUser } from "@/utils/cookie";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";
const { useAuth } = useStore();
const authStore = useAuth();
const { userInfo } = storeToRefs(authStore);
const inviteData = ref([]);
const invitePersonalData = ref([]);
const flowPersonalData = ref([]);
const flowData = ref([]);
watch(userInfo, (val) => {
  if (!val) {
    invitePersonalData.value = null;
    flowPersonalData.value = null;
  }
});
const getInviteData = async () => {
  const { data } = await leaderBoardApi(
    "invite",
    getNormalUser() ? JSON.parse(getNormalUser()).user_id : ""
  );

  if (userInfo.value) {
    invitePersonalData.value = data.data.caller_rank;
  }

  inviteData.value = data.data.rank;
};

const getFlowData = async () => {
  const { data } = await leaderBoardApi(
    "flow",
    getNormalUser() ? JSON.parse(getNormalUser()).user_id : ""
  );

  if (userInfo.value) {
    flowPersonalData.value = data.data.caller_rank;
  }
  flowData.value = data.data.rank;
};

onMounted(() => {
  getInviteData();
  getFlowData();
});
</script>

<style lang="scss" scoped>
.leaderBoardWrap {
  display: flex;
  text-align: center;
  padding: 10px;
  .leftLB,
  .rightLB {
    margin-left: 5px;
    margin-right: 5px;
    position: relative;
    width: calc(100% - 10px);
    background: $leaderBoard-content-bg;
    border-radius: 20px;
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
      background: $leaderBoard-title-bg;
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
        color: rgb(220, 195, 255);
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
        color: #fff;
      }
    }
    .scroll {
      height: 540px;
      padding-bottom: 1rem;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-track {
        background: $scrollbar-track-bg;
      }
      &::-webkit-scrollbar-thumb {
        background: $scrollbar-thumb-bg;
        // border-radius: 20px;
      }
      &::-webkit-scrollbar-button {
        // background: transparent;
      }

      .top3 {
        height: 200px;
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
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
            .player {
              color: gray;
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
                color: $error-color;
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
        .lessThan3 {
          margin-right: 350px;
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
      }
    }

    .rankContent4 {
      .first {
        .rank {
          color: #fff;
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
    .rankContentBottom {
      // display: flex;
      // justify-content: space-between;
      // margin: 0 auto;
      // height: 3.5rem;
      // line-height: 3.5rem;
      // width: 90%;
      margin: 2%;
      border-top: 1px solid #efe095;
      width: 90%;
      margin: 0 auto 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 0 0 10px 10px;
      padding: 2.2%;
      color: #efe095;
      .second {
        display: inline-block;
        width: 200px;
        text-align: start;
        // margin-left: -10%;
      }
      .third {
        width: 200px;
        display: inline-block;
        text-align: end;
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
        border-radius: $border-radius-md;
        padding: 2.2%;

        .acc {
          display: inline-block;
          width: 200px;
          text-align: start;
          // margin-left: -10%;
          color: #fff;
        }
        .player {
          color: gray;
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
            color: $error-color;
          }
        }
        .score {
          width: 200px;
          display: inline-block;
          text-align: end;
          color: yellow;
        }
      }
      .even {
        background: $leaderBoard-table-even-bg;
      }
    }
  }
}
</style>
