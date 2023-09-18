import { defineStore } from "pinia";
export const useActivityList = defineStore("activityListStore", {
  state: () => ({
    selectStatus: "promotion",
  }),
});
