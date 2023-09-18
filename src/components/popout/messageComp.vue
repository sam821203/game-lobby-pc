<template>
  <div class="message-wrap" @click="handleAction('cancelAction')"></div>
  <div :class="['message', type]">
    <div class="title" v-if="titleBar">
      <span>{{ title }}</span>
      <div class="close">
        <img
          src="@/assets/images/layouts/close.png"
          @click="handleAction('cancel')"
        />
      </div>
    </div>
    <div class="container">
      <div class="text">
        <div
          :class="['content slot', textSize(slot?.length)]"
          v-html="slot"
          v-if="slot"
        ></div>
        <ul class="content" v-else-if="contentList">
          <li class="list" v-for="(li, index) in contentList" :key="index">
            <div>{{ li.title }}</div>
            <div class="list__right">
              <span class="tag" v-if="index === contentList.length - 1">R$</span
              >{{ li.info }}
            </div>
          </li>
        </ul>
        <p
          :class="[
            'content normal',
            { nowrap: content.length < 10 },
            textSize($t(content, { contentVal })),
          ]"
          v-else
          ref="normalContent"
        >
          {{ $t(content, { ...contentVal }) }}
        </p>
      </div>
      <div class="button-group" v-if="hasBtn">
        <baseButton
          :bgType="'big_confirmBtn'"
          mode="rounded light"
          @click="handleAction('cancel')"
          v-if="hasCancel"
          >{{ entryGame ? "Espere" : $t("openMsg.cancel") }}
        </baseButton>
        <baseButton
          :bgType="'big_confirmBtn'"
          mode="rounded light"
          v-if="hasContentList"
          @click="handleAction('confirm')"
        >
          {{ deposit ? "Depósito" : $t("openMsg.confirmReceive") }}
        </baseButton>
        <baseButton
          :bgType="'big_confirmBtn'"
          mode="rounded light"
          class="test"
          @click="handleAction('confirm')"
          v-else
        >
          {{ deposit ? "Depósito" : $t("openMsg.confirm") }}
        </baseButton>
      </div>
      <div v-if="isContectService && !hasBtn">
        <button class="callService" @click="setserviceConectData(true)">
          {{ $t("Entrar em contato com o serviço de atendimento ao cliente.") }}
        </button>
        <button @click="handleAction('cancel')" class="cancel">
          {{ $t("OK") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from "@/store/msgStore";
import { storeToRefs } from "pinia";
import { useLanguage } from "@/store/languageStore";
import baseButton from "@/components/form/baseButton";
import { getGameUrlApi } from "@/api/game";
import { useStore } from "@/store/index";
import { useRouter } from "vue-router";
import { serviceConect } from "@/store/serviceConnet";
const { setserviceConectData } = serviceConect();
const router = useRouter();
// const route = useRoute();
const { useGame, useSounds } = useStore();
const game = useGame();
const { studio, gameId, category } = storeToRefs(game);
const soundStore = useSounds();
const { bgmSound, SeButtonValue } = storeToRefs(soundStore);
// const cancelBtn = ref("cancelBtn");
const msg = useMessage();
const { beforeClose } = msg;
const {
  title,
  content,
  hasBtn,
  type,
  contentVal,
  contentList,
  slot,
  hasCancel,
  hasContentList,
  entryGame,
  deposit,
  joinGame,
  isContectService,
  titleBar,
} = storeToRefs(msg);
const langStore = useLanguage();
const { curLang } = storeToRefs(langStore);

const textSize = (len) => {
  return (len > 30 && (curLang.value !== "ch" || curLang.value !== "zhtw")) ||
    (len > 13 && (curLang.value === "ch" || curLang.value === "zhtw"))
    ? "smallText"
    : "bigText";
};

const handleAction = (action) => {
  if (action === "confirm") {
    save();
  } else if (
    action === "cancel" &&
    entryGame.value === true &&
    joinGame.value === false
  ) {
    close();
  } else if (action === "cancel" && joinGame.value === true) {
    enterGame();
  } else {
    close();
  }
  msg.$patch({
    title: "",
    content: "",
    slot: "",
  });
};

const close = () => {
  beforeClose("cancel");
};

const save = () => {
  beforeClose("confirm");
};

const enterGame = async () => {
  const data = {
    sound: SeButtonValue.value === "on" ? true : false,
    bgm: bgmSound.value,
    lang: "en-US",
  };
  // const { category, studio: targetStudio } = target.value;

  const Studio = studio.value;
  const GameId = gameId.value;
  // const Category = category.value;
  const res = await getGameUrlApi(Studio, GameId, data);
  game.$patch({
    gameUrl: res.data.data.url,
  });
  router.push({
    // category.value === null ? "toIndex" : category.value  懶得修，直接參照 大廳進遊戲的處理方式來處理
    path: `/gameRoom/${
      category.value === null ? "toIndex" : category.value
    }/${Studio}`,
    query: { hasHomeBtn: studio !== "joygames" && studio !== "goldenwind" },
  });
};
</script>

<style lang="scss">
.callService {
  display: block;
  width: 80%;
  margin: auto;
  padding: 0.5rem 1rem;
  height: 60px;
  background: $anotherservice-btn-bg;
  border-radius: 5px;
  color: white;
  // padding: 1rem;
}
.cancel {
  display: block;
  width: 80%;
  margin: auto;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: $confirm-btn-bg;
  color: white;
  height: 60px;
  border-radius: 5px;
}
</style>
