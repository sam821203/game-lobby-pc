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
      <div class="view-wrap">
        <router-view />
      </div>
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
    background: $popoutTop-color;
    .links {
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-radius: $border-radius-md;
      background: $group-content-box-bg;
    }
    a {
      padding: 6% 6% 4% 6%;
      font-size: 14px;
      color: $func-button-color-default;
      text-align: center;
      font-weight: 600;
      text-decoration: none;
      border-radius: $border-radius-md;
      &.router-link-active {
        color: $title;
        background: $func-button-bg-selected;
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
  background: $scrollbar-thumb-bg;
  border-radius: 10px;
}
.view-wrap {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
