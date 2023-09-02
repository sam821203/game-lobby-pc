import { defineStore } from "pinia";
export const usectrlLogin = defineStore("ctrlLogin", {
  state: () => ({
    loginpageStatus: false, //登入登出/註冊 列表狀態
    bgmStatus: false, //BGM彈窗
    userInfosetting: false, //使用者資訊
    changeLoginPwd: false, //更改密碼
    changeTradePwd: false, //更改交易密碼
    // inviteFriendid: "",
  }),
  actions: {
    changeloginpageStatus(bool) {
      this.loginpageStatus = bool;
      if (!bool) {
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    },
  },
});
