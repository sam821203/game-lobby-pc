<template>
  <div class="footerWrap">
    <!-- 關於我們 -->
    <div class="part1">
      <p class="part1Title">{{ $t("關於我們") }}</p>
      <div class="part1Content1">
        <div class="q&a" @click="router.push('/info/aboutUs/Q&A')">
          {{ $t("Q&A") }}
        </div>
        <div
          class="termsOfService"
          @click="router.push('/info/aboutUs/termOfService')"
        >
          {{ $t("服務條款") }}
        </div>
        <div class="policy" @click="router.push('/info/aboutUs/privacyPolicy')">
          {{ $t("隱私政策") }}
        </div>
        <div
          class="responsible"
          @click="router.push('/info/aboutUs/responsibleGaming')"
        >
          {{ $t("理性博彩") }}
        </div>
      </div>
      <div class="part1Content2">
        <img
          src="@/assets/images/lobby/Telegram.png"
          alt="tg"
          class="tg"
          @click="openWebsite('https://t.me/evostake')"
        />
        <img
          src="@/assets/images/lobby/Facebook.png"
          alt="fb"
          class="fb"
          @click="
            openWebsite(
              'https://www.facebook.com/profile.php?id=100093583872322'
            )
          "
        />
        <img
          src="@/assets/images/lobby/messenger.png"
          alt="msg"
          class="msg"
          @click="
            openWebsite(
              'https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F113053535151915%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink%26source_id%3D1441792%26recurring_notification%3D0'
            )
          "
        />
      </div>
    </div>

    <div class="part2">
      <img
        :src="require(`@/assets/images/statement/${k}.png`)"
        v-for="(v, k) in 9"
        :key="k"
      />
    </div>

    <div class="part3">
      <img
        :src="require(`@/assets/images/i18n/${curLang?.name}/homeLogo.png`)"
        alt="logo"
        class="logo"
      />
      <p class="claim">
        O jogo pode ser viciante. Por favor, jogue com responsabilidade. A Blaze
        apenas aceita clientes com mais de 18 anos de idade.
      </p>
      <p class="copyright">© 2023-2025 Evostake.com All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();
const { useLanguage } = useStore();
const lang = useLanguage();
const { curLang } = storeToRefs(lang);

const openWebsite = (url) => {
  window.open(url);
};
</script>

<style lang="scss" scoped>
.footerWrap {
  padding: 2% 5%;
  text-align: center;
  background-color: #212529;
  .part1 {
    border-bottom: 1px solid #999999;
    padding-bottom: 2%;
    .part1Title {
      margin-bottom: 2.5%;
    }
    .part1Content1 {
      display: flex;
      justify-content: space-around;
      margin-bottom: 2.5%;
      color: gray;
    }
    .part1Content2 {
      width: 20%;
      margin: 0 auto;
      display: flex;
      justify-content: space-evenly;
      img {
        width: 30px;
      }
    }
  }
  .part2 {
    display: flex;
    justify-content: space-between;
    padding: 2% 0;
    border-bottom: 1px solid #999999;
    img {
      width: 10%;
    }
  }

  .part3 {
    color: #a6a6a6;
    padding: 2% 0;
    .logo {
      width: 10%;
      filter: brightness(0.5);
    }
    .claim {
      margin-top: 2%;
    }
    .copyright {
      margin-top: 1.5%;
    }
  }
}
</style>
