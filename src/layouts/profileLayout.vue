<template>
  <div class="operationWrap">
    <div class="sidebarWrap">
      <div class="navbar">
        <img src="@/assets/images/memberCenter/icon.png" alt="" />
        <h2 class="title">{{ $t("我的") }}</h2>
      </div>
      <ul class="selectList">
        <li :class="{ friends: routeName === 'friends' }">
          <router-link to="/operation/friends">Amigos</router-link>
        </li>
        <li :class="{ vip: routeName === 'vip' }">
          <router-link to="/operation/vip">VIP</router-link>
        </li>
        <li :class="{ gameRecord: routeName === 'gameRecord' }">
          <router-link to="/operation/gameRecord">Dados do jogo</router-link>
        </li>
        <li :class="{ tradeRecord: routeName === 'tradeRecord' }">
          <router-link to="/operation/tradeRecord">Transações</router-link>
        </li>
      </ul>
    </div>

    <main class="main">
      <router-view />
    </main>
  </div>
  <FooterComp />
  <Footer />
</template>

<script setup>
import { computed } from "vue";
import FooterComp from "@/layouts/components/footerComp.vue";
import Footer from "@/layouts/components/footer.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const routeName = computed(() => route.name);
</script>

<style lang="scss" scoped>
.operationWrap {
  margin-top: 3.5rem;
  padding: 0 5% 0 2%;
  display: flex;
  justify-content: space-between;
  .sidebarWrap {
    width: 20%;
    padding-top: 1%;
    .navbar {
      width: 60%;
      display: flex;
      align-items: baseline;
      justify-content: space-evenly;
      margin-bottom: 2%;
      .title {
        text-align: start;
        color: rgb(226, 209, 254);
        margin: 0;
      }
      img {
        width: 20%;
      }
    }
  }

  .selectList {
    background: $group-content-box-bg;
    border-radius: $border-radius-md;
    padding: 5%;
    color: rgb(136, 105, 157);
    text-align: center;
    li {
      margin-bottom: 5%;
      padding: 5%;
      a {
        color: rgb(136, 105, 157);
        text-decoration: none;
      }
    }
    .friends,
    .vip,
    .gameRecord,
    .tradeRecord {
      background: $func-button-bg-selected;
      border-radius: 5px;
      a {
        color: $title;
      }
    }
  }
  .main {
    padding-bottom: 6rem;
    width: 100%;
    margin-left: 2%;
    height: 920px;
  }
}
</style>
