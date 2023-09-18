<template>
  <div class="content authWrap" v-show="inviteFriends">
    <div class="navbar center">
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        style="visibility: hidden"
        @click="closeModal"
      />
      <div class="logo">Amigos</div>
      <img
        src="@/assets/images/layouts/close.png"
        class="close"
        @click="closeModal"
      />
    </div>
    <div class="contentWrap">
      <h3 class="subtitle">{{ $t("friendQrcode.title") }}</h3>
      <div>
        <div class="QRcode">
          <QrcodeVue :value="link" :size="150" id="qrcodeImage" />
        </div>
      </div>
      <p class="link">{{ link }}</p>
      <div class="copyAndDownload">
        <div class="copy" @click="download">
          <img
            src="@/assets/images/modal/download.png"
            alt="download"
            class="download"
          />
          <p>Baixar imagem</p>
        </div>
        <div class="copy" @click="copy">
          <img src="@/assets/images/modal/copy.png" alt="copy" />
          <p>Copiar link</p>
        </div>
      </div>
      <p>Regras da atividade:</p>
      <p>
        1. Forneça o código QR ou URL de registro para seus amigos
        digitalizarem. Quando seu amigo se registrar com sucesso, você se
        tornará o primeiro nível de seu amigo. Sempre que seu amigo cumprir as
        condições, você poderá obter o bônus correspondente.
      </p>
      <p>
        2. Se seus amigos convidarem outras pessoas para se registrarem, então
        os amigos dos seus amigos se tornarão seus jogadores de nível 2, e assim
        por diante.
      </p>
      <p>3. Os bônus que podem ser obtidos são os seguintes:</p>
      <table border="1">
        <tr>
          <td class="tableTitle">Nível de convite</td>
          <td class="tableTitle">
            Comissão de Apostas Válidas dos seus amigos
          </td>
        </tr>
        <tr>
          <td>Level 1</td>
          <td>0.5%</td>
        </tr>
        <tr>
          <td>Level 2</td>
          <td>0.25%</td>
        </tr>
        <tr>
          <td>Level 3</td>
          <td>0.1%</td>
        </tr>
        <tr>
          <td>Level 4</td>
          <td>0.05%</td>
        </tr>
        <tr>
          <td>Level 5</td>
          <td>0.02%</td>
        </tr>
      </table>
      <p>
        4. Reembolso é resgatável sem quaisquer restrições, mas se houver outros
        requisitos de apostas, é necessário cumprir esses requisitos antes de
        resgatar.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue-demi";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import QrcodeVue from "qrcode.vue";
import useClipboard from "vue-clipboard3";
import { usectrlLogin } from "@/store/ctrlLogin";
import { usepopoutNotice } from "@/store/popoutNotice";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
const {
  statusType,
  statusStr,
  positionTop,
  borderType,
  countDownWidth,
  inSlidediv,
} = storeToRefs(usepopoutNotice());
const { inviteFriends } = storeToRefs(usectrlLogin());

const { useAuth } = useStore();
const authStore = useAuth();
const { loginData, userInfo } = storeToRefs(authStore);
const { toClipboard } = useClipboard();

const agentName = ref(userInfo.value.agent_name);
const api = process.env.VUE_APP_LOBBYAPI;

const link = ref("");
const dev = ref(`http://192.168.88.212/lobby-brazil/?agent=${agentName.value}`);
const uat = ref(`https://${agentName.value}.evostake00.com/lobby`);
const prod = ref(`https://${agentName.value}.evostake.com/lobby`);
const url = ref("");
// link.value = `${url}#/home/${loginData.value.user_uuid}`;

watch(inviteFriends, (val) => {
  if (val) {
    agentName.value = userInfo.value.agent_name;
    dev.value = `http://192.168.88.212/lobby-brazil/?agent=${agentName.value}`;
    uat.value = `https://${agentName.value}.evostake00.com/lobby`;
    prod.value = `https://${agentName.value}.evostake.com/lobby`;
    url.value = api.includes("192")
      ? dev.value
      : api.includes("evostake00")
      ? uat.value
      : prod.value;
    link.value = `${url.value}#/home/${loginData.value.user_uuid}`;
  }
});

const copy = async () => {
  try {
    await toClipboard(link.value);
    statusType.value = 2;
    statusStr.value = t("複製成功");
    positionTop.value = "10px";
    borderType.value = 2;
    countDownWidth.value = 100;
    inSlidediv.value = true;
  } catch (e) {
    console.log(e);
  }
};

const download = async () => {
  try {
    var myImg = await document.querySelector("#qrcodeImage");
    // myImg.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = myImg.toDataURL("image/jpeg", 1.0);
    // link.href = this.downloadUrl;
    a.download = "qrcode.jpg";
    a.click();
    statusType.value = 2;
    statusStr.value = t("下載成功");
    positionTop.value = "10px";
    borderType.value = 2;
    countDownWidth.value = 100;
    inSlidediv.value = true;
  } catch (e) {
    console.log(e);
  }
};

const closeModal = () => {
  usectrlLogin().$patch({
    inviteFriends: false,
  });
};
</script>

<style lang="scss" scoped>
:deep(.page) {
  padding: 10px 15px 0px 15px !important;
}
.contentWrap {
  padding: 5%;
  .subtitle {
    color: #fff;
    font-size: 14px;
  }

  .QRcode {
    border: 5px solid $func-button-color-default;
    border-radius: 20px;
    width: fit-content;
    margin: 0 auto;
    padding: 8px;
  }

  .copyAndDownload {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 5%;
    .copy {
      width: 35%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: $anotherservice-btn-bg;
      border-radius: 5px;
      padding: 2%;
      img {
        width: 12%;
      }
      .download {
        width: 10%;
      }
      p {
        color: white;
        margin: 0;
      }
    }
  }

  .link {
    margin: 10px 0 10px;
    width: 100%;
    color: $func-button-color-default;
    text-decoration: underline;
    text-align: center;
  }

  .hideTextarea {
    opacity: 0;
    position: absolute;
    bottom: 0;
  }
  p {
    color: #fff;
    text-align: start;
    font-size: 10px;
    word-break: break-word;
    margin-bottom: 2%;
  }
  table {
    color: #fff;
    font-size: 10px;
    border-collapse: collapse;
    margin-bottom: 2%;
    tr {
      background: white;
      color: black;
      .tableTitle {
        background: $table-title-bg;
        color: #fff;
        padding: 3px;
      }
    }
  }
}
</style>
