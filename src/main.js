import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import pinia from "@/store/pinia";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import time from "@/directive/time";
import sliceText from "@/directive/sliceText";
import sliceAccount from "@/directive/sliceAccount";
import slicePixKey from "@/directive/slicePixKey";
import sliceLast from "@/directive/sliceLast";
import i18n from "./utils/i18n";
import { useLanguage } from "@/store/languageStore";
import AudioPlayer from "@liripeng/vue-audio-player";
import * as PIXI from "pixi.js";
import price from "@/directive/price";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { ElProgress } from "element-plus";
import "element-plus/dist/index.css";
import BaseCard from "@/components/UI/baseCard.vue";
import BaseHeader from "@/components/UI/baseHeader.vue";
import BaseTag from "@/components/UI/baseTag.vue";
import BaseSelectBox from "@/components/UI/baseSelectBox.vue";
import BaseTabFilter from "@/components/UI/baseTabFilter.vue";

PIXI.utils.skipHello();
const app = createApp(App);
const languageStore = useLanguage();
const { getCurLang } = languageStore;
getCurLang();

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(moment);
app.use(momentTimeZone);
app.use(AudioPlayer);
app.use(ElProgress);

app.mount("#app");

app.directive("price", price);
app.directive("time", time);
app.directive("sliceText", sliceText);
app.directive("sliceAccount", sliceAccount);
app.directive("slicePixKey", slicePixKey);
app.directive("sliceLast", sliceLast);

app.component(VueCountdown.name, VueCountdown);
app.component("BaseCard", BaseCard);
app.component("BaseHeader", BaseHeader);
app.component("BaseTag", BaseTag);
app.component("BaseSelectBox", BaseSelectBox);
app.component("BaseTabFilter", BaseTabFilter);