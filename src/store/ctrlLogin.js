import { defineStore } from "pinia";
export const usectrlLogin = defineStore("ctrlLogin", {
  state: () => ({
    loginpageStatus: false, //登入登出/註冊 列表狀態
    registerpageStatus: false,
    bgmStatus: false, //BGM彈窗
    userInfosetting: false, //使用者資訊
    changeLoginPwd: false, //更改密碼
    changeTradePwd: false, //更改交易密碼
    depositPageStatus: false, //存款介面
    //
    withdrawalPageStatus: false, //提款介面
    addpixPageStatus: false, //新增PIX介面
    withdrawalPage_checkTradePwdStatus: false, //提款介面，檢查交易密碼的介面
    inviteFriends: false, //邀請好友QRcode
    rebateForm: false, //好友返利統計
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
