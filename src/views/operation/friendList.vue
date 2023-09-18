<template>
  <div class="friendsView">
    <div class="search">
      <div class="input">
        <input
          type="text"
          v-model="account"
          :placeholder="$t('friends.enterAccount')"
        />
        <img src="@/assets/images/modal/search.png" @click="searchFriend" />
      </div>

      <div class="select" @click="openSelect = !openSelect">
        <ul>
          <li>{{ vip === "all" ? $t("friends.allLevels") : `VIP ${vip}` }}</li>
        </ul>
        <img
          src="@/assets/images/modal/list_open1.png"
          :class="{ open: openSelect }"
        />
        <ul v-if="openSelect" :class="{ open: openSelect }">
          <li @click="vip = 'all'" v-if="vip !== 'all'" class="option">
            {{ $t("friends.allLevels") }}
          </li>

          <li
            v-for="(num, index) in 6"
            :key="num"
            @click="vip = index"
            class="option"
          >
            VIP {{ index }}
          </li>
        </ul>
      </div>
      <div class="select" @click="openCondition = !openCondition">
        <ul>
          <li>
            {{ condition === $t("好友帳號") ? $t("好友帳號") : $t(condition) }}
          </li>
        </ul>
        <img
          src="@/assets/images/modal/list_open1.png"
          :class="{ open: openCondition }"
        />
        <ul v-if="openCondition" :class="{ open: openCondition }">
          <li
            v-for="(item, index) in conditionList"
            :key="index"
            @click="changeOrder(item)"
            class="option"
          >
            {{ $t(item) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="leftItem">
        <div class="amount">
          <span>Amigos: </span><span>{{ totalFriendsAmount }}</span>
        </div>

        <div class="amount">
          <span>Depósito de amigos: </span
          ><span v-price="depositFriends * 10000"></span>
        </div>
        <div class="amount">
          <span>Reembolso Total: </span
          ><span @click="rebatePopup" class="totalRebate">{{
            totalRebate / 10000
          }}</span>
        </div>
        <div class="amount">
          <span>Convidar: </span
          ><img
            class="icon"
            src="@/assets/images/memberCenter/InviteFriends2.png"
            alt=""
            @click="invitePopup"
          />
        </div>
      </div>
    </div>
    <div class="list" v-if="newfriendsData.length">
      <table>
        <tr class="listTitle">
          <td class="account">Conta de amigos</td>
          <td>Depósito total</td>
          <td>Apostas válidas</td>
          <td>Reembolso recebido</td>
        </tr>
        <tr
          v-for="(item, index) in newfriendsData"
          :key="index"
          :class="[{ odd: index % 2 === 0 }, { even: index % 2 !== 0 }]"
        >
          <td class="vip">
            <div class="iconWrap" v-if="item.vip !== 0">
              <img
                src="@/assets/images/lobby/vip_icon.png"
                alt="vip"
                class="crown"
              />
              <img
                :src="require(`@/assets/images/lobby/vip_${item.vip}.png`)"
                alt="vip"
                class="word"
              />
            </div>
            <div class="VIP0" v-else></div>

            <span class="acc">{{ item.account }}</span>
          </td>
          <td v-price="item.history_charge"></td>
          <td v-price="item.flow"></td>
          <td v-price="item.rebate"></td>
        </tr>
      </table>
    </div>
    <div class="list" v-else>
      <table>
        <tr class="listTitle">
          <td class="account">Conta de amigos</td>
          <td>Depósito total</td>
          <td>Apostas válidas</td>
          <td>Reembolso recebido</td>
        </tr>
        <tr
          v-for="(item, index) in 10"
          :key="index"
          :class="[{ odd: index % 2 === 0 }, { even: index % 2 !== 0 }]"
        >
          <td class="vip">
            <div class="iconWrap"></div>

            <span class="acc"></span>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    <div v-if="!newfriendsData.length" class="noData">
      <img src="@/assets/images/no_data.png" alt="Cryingface" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue-demi";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { getFriendsApi, getRebateApi } from "@/api/friends";
import { usectrlLogin } from "@/store/ctrlLogin";

const { useAuth } = useStore();
const authStore = useAuth();
const { loginData } = storeToRefs(authStore);
const vip = ref("all");
const openSelect = ref(false);
const openCondition = ref(false);
const condition = ref("好友帳號");
const conditionList = ref(["好友帳號", "總存款", "有效投注", "返利"]);
const friendsData = ref("");
const newfriendsData = ref([]);
const depositFriends = ref(0);
// const chargedAry = ref([]);
// const sortAry = ref([]);
const totalFriendsAmount = ref(0);
const startTime = ref(new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
const endTime = ref(new Date().toISOString());
const totalRebate = ref(0);

const getData = async () => {
  const { data } = await getFriendsApi(loginData.value.user_id);
  if (data.code !== 0) return;
  friendsData.value = data.data ?? [];
  friendsData.value.forEach((item) => {
    if (item.history_charge > 0) {
      depositFriends.value++;
    }
  });
  totalFriendsAmount.value = friendsData.value.length;
  newfriendsData.value = friendsData.value;
  // 使用sort()方法排序 -- 預設依照帳號順序
  newfriendsData.value.sort(accSort);
};
getData();

//依帳號排序
const accSort = (a, b) => {
  // 先判斷a、b哪個名稱以英文字母開頭
  const aStartsWithLetter = isNaN(parseInt(a.account.charAt(0)));
  const bStartsWithLetter = isNaN(parseInt(b.account.charAt(0)));

  // 如果a、b都是以英文字母開頭，或者都不是以英文字母開頭，就直接比較名稱和數字
  if (aStartsWithLetter === bStartsWithLetter) {
    // 先比較名稱，如果名稱相同再比較數字
    if (a.account === b.account) {
      return a.account - b.account;
    } else {
      return a.account.localeCompare(b.account);
    }
  }

  // 如果a是以英文字母開頭，就讓a排在b前面
  if (aStartsWithLetter) {
    return -1;
  }

  // 如果b是以英文字母開頭，就讓b排在a前面
  return 1;
};

//依總存款排序
const totalDepositSort = (a, b) => {
  return b.history_charge - a.history_charge;
};

//依有效投注排序
const flowSort = (a, b) => {
  return b.flow - a.flow;
};

//依返利排序
const rebateSort = (a, b) => {
  return b.rebate - a.rebate;
};

//取得總投注
const getRebate = async () => {
  const { data } = await getRebateApi(startTime.value, endTime.value);
  totalRebate.value = data.data.total;
};

getRebate();

//切換排序
const changeOrder = (order) => {
  condition.value = order;
  switch (order) {
    case "好友帳號":
      newfriendsData.value.sort(accSort);
      break;
    case "總存款":
      newfriendsData.value.sort(totalDepositSort);
      break;
    case "有效投注":
      newfriendsData.value.sort(flowSort);
      break;
    case "返利":
      newfriendsData.value.sort(rebateSort);
      break;
  }
};

// VIP 資料
const vipData = () => {
  if (vip.value === "all") return friendsData.value;
  return friendsData.value.filter(({ vip: level }) => level === +vip.value);
};

// 搜尋玩家
const account = ref("");
const searchFriend = () => {
  if (!account.value) {
    newfriendsData.value = vipData();
    return;
  }

  newfriendsData.value = vipData().filter((item) =>
    item.account.match(account.value)
  );
};

//開啟好友返利統計彈窗
const rebatePopup = () => {
  usectrlLogin().$patch({
    rebateForm: true,
  });
};

//開啟邀請彈窗
const invitePopup = () => {
  usectrlLogin().$patch({
    inviteFriends: true,
  });
};

// 切換 VIP 等級
watch(vip, () => {
  account.value = "";
  newfriendsData.value = vipData();
});
</script>

<style lang="scss" scoped>
.friendsView {
  position: relative;
  padding: 2%;
  border-radius: $border-radius-md;
  .select ul,
  input {
    border: 1px solid rgb(132, 100, 154);
    border-radius: $border-radius-md;
    padding: 8px;
    width: 100%;
    font-size: 14px;
    background: $default-input-bg;
    color: rgb(201, 182, 230);
    &::-webkit-input-placeholder {
      color: rgb(201, 182, 230);
      font-weight: 600;
    }
  }
  .search {
    display: flex;
    width: 95%;
    margin: 2% auto;
    justify-content: space-between;
    .input {
      position: relative;
      width: 30%;
      margin-right: 2%;

      img {
        position: absolute;
        right: 0;
        width: 41px;
        cursor: pointer;
      }
    }

    .select {
      width: 30%;
      position: relative;
      cursor: pointer;
      ul {
        background: $default-input-bg;
        font-weight: 600;
        position: absolute;
        z-index: 1;
        overflow: hidden;
        color: rgb(201, 182, 230);
        font-size: 13px;

        &.open {
          height: auto;
          margin-top: 18%;
          border: none;
          background: $group-content-box-bg;
          .option {
            height: 2rem;
            padding: 3%;
          }
        }
        li {
          margin-bottom: 10px;
          &.option {
            color: rgb(116, 93, 148);
            border-bottom: 1px solid transparent;
            width: fit-content;
            &:hover {
              color: rgb(223, 202, 254);
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      img {
        position: absolute;
        z-index: 2;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        width: 12px;
        &.open {
          transform: translateY(-50%) scaleY(-1);
        }
      }
    }
  }
  .content {
    text-align: center;
    margin: 2%;
    font-weight: 600;
    .leftItem {
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: rgb(223, 202, 254);
      .amount {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        span {
          &:first-child {
            margin-right: 3%;
          }
        }
        .totalRebate {
          color: dodgerblue;
          cursor: pointer;
        }
      }
    }
    img {
      cursor: pointer;
      width: 25%;
      margin-left: 3%;
    }
  }

  .list {
    max-height: 700px;
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

    table {
      width: 100%;
      border-style: none;
      border-collapse: collapse;
      text-align: center;
      margin: 0 2%;
      @include breakpoint-up("lg") {
        margin: 0 auto;
      }
      .listTitle {
        position: sticky;
        top: 0;
      }

      tr {
        height: 3rem;
        line-height: 3rem;

        td {
          .crown {
            width: 35px;
          }
          .word {
            width: 30px;
            margin-top: 1px;
          }
          span {
          }
          .acc {
            color: #fff;
            font-size: 14px;
            margin-left: 2%;
          }
        }

        .account {
          text-align: center;
        }
        .vip {
          margin: 0 auto;
          width: 60%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .iconWrap {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .acc {
            width: 60%;
            text-align: start;
          }
        }
        &:first-child {
          background: $my-func-button-bg;
          color: rgb(180, 150, 227);
          height: 3.5rem;
          td {
            padding: 0;
            @include breakpoint-up("lg") {
              width: 20%;
            }
          }
        }
      }
      .odd {
        background: $func-button-bg-selected;
      }
      .even {
        background: $my-func-button-bg;
      }
    }
  }

  .noData {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
