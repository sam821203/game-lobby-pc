<template>
  <p class="vipTitle">Progresso VIP</p>
  <div class="vipWrap">
    <img src="@/assets/images/lobby/vip_icon.png" alt="vip" class="vip" />
    <span class="vipLv">VIP{{ playerLevel }}</span>
  </div>
  <div class="progressWrap">
    <!-- LV.0 to 1 -->
    <div class="item-wrap item1" v-if="playerLevel === 0">
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
          color="#971dba"
        />
        <p>{{ $t("vip.validBets") }} : 500</p>
      </div>
    </div>

    <!-- LV.1 to 2-->
    <div class="item-wrap item2" v-if="playerLevel === 1">
      <div class="item">
        <el-progress
          type="circle"
          :percentage="
            Math.floor((playerCharge / 1000) * 100) >= 100
              ? 100
              : Math.floor((playerCharge / 1000) * 100)
          "
          color="#971dba"
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
          color="#971dba"
        />
        <p>{{ $t("vip.validBets") }} : 10,000</p>
      </div>
    </div>

    <!-- LV.2 to 3-->
    <div class="item-wrap item3" v-if="playerLevel === 2">
      <div class="item">
        <el-progress
          type="circle"
          :percentage="
            Math.floor((playerCharge / 5000) * 100) >= 100
              ? 100
              : Math.floor((playerCharge / 5000) * 100)
          "
          color="#971dba"
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
          color="#971dba"
        />
        <p>{{ $t("vip.validBets") }} : 50,000</p>
      </div>
    </div>

    <!-- LV.3 to 4-->
    <div class="item-wrap item3" v-if="playerLevel === 3">
      <div class="item">
        <el-progress
          type="circle"
          :percentage="
            Math.floor((playerCharge / 15000) * 100) >= 100
              ? 100
              : Math.floor((playerCharge / 15000) * 100)
          "
          color="#971dba"
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
          color="#971dba"
        />
        <p>{{ $t("vip.validBets") }} : 150,000</p>
      </div>
    </div>

    <!-- LV.4 to 5-->
    <div class="item-wrap item4" v-if="playerLevel === 4">
      <div class="item">
        <el-progress
          type="circle"
          :percentage="
            Math.floor((playerCharge / 50000) * 100) >= 100
              ? 100
              : Math.floor((playerCharge / 50000) * 100)
          "
          color="#971dba"
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
          color="#971dba"
        />
        <p>{{ $t("vip.validBets") }} : 500,000</p>
      </div>
    </div>
  </div>
  <div class="bonusWrap">
    <p class="vipBonus">Privilégios e benefícios VIP</p>
    <!-- VIP1 bonus -->
    <div class="bonus">
      <div class="bonusTitle VIP1" @click="open(1)">
        <img
          src="@/assets/images/modal/list_open2.png"
          alt=""
          :class="['list-open', { open: openList.includes(1) }]"
        />
        <span>VIP1</span>
      </div>
      <div class="bonusContent" v-if="openList.includes(1)">
        <p>
          Bônus de Avanço de Nível : 1 Retirada Diária : ∞ Limite de Retirada :
          ∞
        </p>
      </div>
    </div>
    <!-- VIP2 bonus -->
    <div class="bonus">
      <div class="bonusTitle VIP2" @click="open(2)">
        <img
          src="@/assets/images/modal/list_open2.png"
          alt=""
          :class="['list-open', { open: openList.includes(2) }]"
        />
        <span>VIP2</span>
      </div>
      <div class="bonusContent" v-if="openList.includes(2)">
        <p>
          Bônus de Avanço de Nível : 8 Retirada Diária : ∞ Limite de Retirada :
          ∞
        </p>
      </div>
    </div>
    <!-- VIP3 bonus -->
    <div class="bonus">
      <div class="bonusTitle VIP3" @click="open(3)">
        <img
          src="@/assets/images/modal/list_open2.png"
          alt=""
          :class="['list-open', { open: openList.includes(3) }]"
        />
        <span>VIP3</span>
      </div>
      <div class="bonusContent" v-if="openList.includes(3)">
        <p>
          Bônus de Avanço de Nível : 38 Retirada Diária : ∞ Limite de Retirada :
          ∞
        </p>
      </div>
    </div>
    <!-- VIP4 bonus -->
    <div class="bonus">
      <div class="bonusTitle VIP4" @click="open(4)">
        <img
          src="@/assets/images/modal/list_open2.png"
          alt=""
          :class="['list-open', { open: openList.includes(4) }]"
        />
        <span>VIP4</span>
      </div>

      <div class="bonusContent" v-if="openList.includes(4)">
        <p>
          Bônus de Avanço de Nível : 188 Retirada Diária : ∞ Limite de Retirada
          : ∞
        </p>
      </div>
    </div>
    <!-- VIP5 bonus -->
    <div class="bonus">
      <div class="bonusTitle VIP5" @click="open(5)">
        <img
          src="@/assets/images/modal/list_open2.png"
          alt=""
          :class="['list-open', { open: openList.includes(5) }]"
        />
        <span>VIP5</span>
      </div>
      <div class="bonusContent" v-if="openList.includes(5)">
        <p>
          Bônus de Avanço de Nível : 688 Retirada Diária : ∞ Limite de Retirada
          : ∞
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { SwiperSlide, Swiper } from 'swiper/vue'
// import { Navigation } from 'swiper'
import { vipApi } from "@/api/info";
// import 'swiper/css'
// import 'swiper/css/navigation'
// const modules = [Navigation]
const playerLevel = ref(null); // 玩家等級
// const lower = ref(null)
// const upper = ref(null)
const playerCharge = ref(null); //總存款
const playerFlow = ref(null); // 總流水
const playerTotalFriends = ref(null); // 總好友數
const vip1Friends = ref(null);
const vip2Friends = ref(null);
const vip3Friends = ref(null);
const openList = ref([]);

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
};
getVip();

const open = (num) => {
  if (!openList.value.includes(num)) {
    openList.value.push(num);
  } else {
    openList.value = openList.value.filter((item) => item !== num);
  }
};

// 滑動切換等級
// const onSlideChange = swiper => {
//   if (swiper.activeIndex <= 5) {
//     lower.value = swiper.activeIndex
//     upper.value = swiper.activeIndex + 1
//   }
// }

// // 顯示玩家當前等級
// const onSwiper = swiper => {
//   swiper.activeIndex = playerLevel.value
//   lower.value = playerLevel.value
//   upper.value = playerLevel.value + 1
// }
</script>

<style lang="scss" scoped>
:deep(.el-progress) {
  .el-progress__text {
    color: #fff;
  }
  .el-progress-circle__track {
    stroke: #3f3149;
  }
}
.vipTitle {
  color: rgb(206, 190, 231);
  padding: 3% 4%;
}
.vipWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 5%;
  }
}

.progressWrap {
  .item-wrap {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: 5%;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      p {
        margin-top: 5%;
      }
    }
  }
}

.bonusWrap {
  width: 92%;
  margin: 0 auto;
  height: 550px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: block;
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: $scrollbar-track-bg;
  }
  &::-webkit-scrollbar-thumb {
    background: $scrollbar-thumb-bg;
    border-radius: 20px;
  }
  .vipBonus {
    color: rgb(206, 190, 231);
    padding: 3% 0;
    margin-top: 10%;
  }
  .bonus {
    margin-bottom: 2%;
    .bonusTitle {
      background: $modal-key;
      padding: 1%;
      border-radius: $border-radius-md;
      position: relative;
      z-index: 20;
      img {
        width: 15px;
        margin-right: 2%;
        transform: rotate(-90deg);
      }
      .open {
        transform: rotate(0deg);
      }
    }
    .bonusContent {
      margin-top: -1%;
      background: $group-content-box-bg;
      padding: 2% 1% 1%;
      border-radius: $border-radius-md;
      color: rgb(180, 155, 221);
    }
  }
}
</style>
