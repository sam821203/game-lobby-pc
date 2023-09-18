<template>
  <!-- <div class="announcement">
    <swiper
      :pagination="true"
      :modules="bannerModules"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      class="swiper"
      :loop="true"
    >
      <swiper-slide v-for="(banner, i) in bannerAry" :key="i">
        <img :src="dealPic(banner.picture_id)" alt="" />
      </swiper-slide>
    </swiper>
  </div> -->
  <div class="announcement">
    <swiper
      :pagination="true"
      :modules="bannerModules"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      class="swiper"
      :loop="true"
    >
      <swiper-slide v-for="(banner, i) in bannerAry" :key="i">
        <img :src="banner.img" alt="" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { computed } from "vue";
// import { useStore } from "@/store/index";
// import { storeToRefs } from "pinia";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper";
import { useLanguage } from "@/store/languageStore";
import { storeToRefs } from "pinia";
// import { useRouter } from "vue-router";
// import { getBannersApi } from "@/api/announcement";
// const router = useRouter();
import "swiper/css";
import "swiper/css/navigation";
import "swiper/scss/pagination";

const bannerModules = [Pagination, Autoplay];

const languageStore = useLanguage();
const { curLang } = storeToRefs(languageStore);
const bannerAry = computed(() => {
  const ary = [];
  const allBannerCount = 5;
  for (let i = 1; i <= allBannerCount; i++) {
    ary.push({
      img: require(`@/assets/images/i18n/${curLang.value.name}/banner_${i}.jpg`),
    });
  }
  return ary;
});
</script>

<style lang="scss" scoped>
.announcement .swiper {
  height: 100%;
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      object-fit: contain;
    }
    .slide-wrap {
      width: 100%;
    }
  }
}
</style>
