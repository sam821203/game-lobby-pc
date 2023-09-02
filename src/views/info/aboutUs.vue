<template>
  <div class="about-us">
    <div class="router-wrap">
      <nav>
        <BaseHeader :content="'關於我們'" :imgSrc="'modal/questions_shield'" />
        <div class="links">
          <router-link to="/info/aboutUs/Q&A">{{ $t("常見問題") }}</router-link>
          <router-link to="/info/aboutUs/termOfService">{{
            $t("服務條款")
          }}</router-link>
          <router-link to="/info/aboutUs/privacyPolicy">{{
            $t("隱私政策")
          }}</router-link>
          <router-link to="/info/aboutUs/responsibleGaming">{{
            $t("理性博彩")
          }}</router-link>
        </div>
      </nav>
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-wrap {
  display: flex;
  justify-content: space-between;
  nav {
    display: flex;
    flex-direction: column;
    width: calc(20% - 12px);
    padding-top: 30px;
    padding-left: 16px;
    padding-right: 16px;
    background-color: $darkpageBottom-color;
    .links {
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-radius: $border-radius-md;
      background-color: $darkpageTop-color;
    }
    a {
      padding: 6% 6% 4% 6%;
      font-size: 12px;
      color: $secondary-text;
      text-align: center;
      font-weight: 600;
      text-decoration: none;
      border-radius: $border-radius-md;
      &.router-link-active {
        color: $primary-title;
        background-color: $primary-bg;
      }
    }
  }
  & > div {
    width: calc(80% - 12px);
    color: $primary;
    overflow-y: scroll;
  }
}
.questions,
.term-of-service,
.privacy-policy,
.responsible-gaming {
  height: 100vh;
  padding: 30px 3% 30px 0;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: transparent;
  border: 1px solid rgba(226, 208, 255, 0.35);
  border-radius: 10px;
}
</style>
