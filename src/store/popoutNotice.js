import { defineStore } from "pinia";
export const usepopoutNotice = defineStore("popoutNotice", {
  state: () => ({
    statusType: 1, //0沒圖，1禁止，2打勾
    statusStr: "",
    positionTop: "",
    borderType: 1, //0有框，1紅框，2綠框
    countDownWidth: 0,
  }),
  actions: {
    async resetpopoutNotice() {
      this.statusType = 0;
      this.statusStr = "";
      this.positionTop = "";
      this.borderType = 0;
      this.countDownWidth = 0;
    },
  },
});
