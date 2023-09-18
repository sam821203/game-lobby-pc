import { defineStore } from "pinia";

export const useModal = defineStore("modalStore", {
  state: () => ({
    curModal: "",
    childView: "",
    tags: [],
    curTag: "",
    isModalOpen: false,
    styleType: "",
    closeBtn: true,
    announcementBriefPage: true, //一進入大廳跳出的公告訊息，要做到按下OK與點旁邊黑框一樣效果特規
  }),
  actions: {
    insertTag(data) {
      this.tags = data;
    },
    findTag(target) {
      this.curTag = target;
    },
    modalType(components, styleType, childName = "") {
      // components: 開啟組件名稱，styleType: 彈跳視窗樣式(search: 查詢類、form: 操作類、error: 錯誤)
      this.curModal = components;
      this.styleType = styleType;
      this.childView = childName;
    },
    toggleModal(boolean) {
      if (this.curModal === "AnnouncementBrief") {
        this.announcementBriefPage = false;
        this.curModal = "";
        this.styleType = "";
        this.childView = "";
      } else {
        this.isModalOpen = boolean;
        if (!boolean) {
          this.curModal = "";
          this.styleType = "";
          this.childView = "";
        }
      }
    },
  },
});
