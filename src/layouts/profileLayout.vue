<template>
  <div class="operationWrap">
    <div class="navbar">
      <h2 class="title">{{ $t("我的") }}</h2>
    </div>
    <ul class="selectList">
      <li>Amigos</li>
      <li>VIP</li>
      <li>Dados do jogo</li>
      <li>Transações</li>
    </ul>
    <main class="main">
      <router-view />
    </main>
  </div>
  <FooterComp />
</template>

<script setup>
import FooterComp from "@/layouts/components/footerComp.vue";
</script>

<style lang="scss" scoped>
.operationWrap {
  margin-top: 3.5rem;
  padding: 2% 5%;
  .navbar {
    width: 100%;
    .title {
      text-align: start;
      color: #fff;
      margin: 0;
    }
  }
  .selectList {
    background: rgb(33, 37, 41);
    width: 15%;
    border-radius: 10px;
    margin-top: 1%;
    padding: 2% 1% 1% 1%;
    color: #808080;
    li {
      border-bottom: 1px solid #808080;
      margin-bottom: 10%;
      padding-bottom: 2%;
    }
  }
  .main {
    margin-top: 4rem;
    padding-bottom: 6rem;
  }
}
</style>
