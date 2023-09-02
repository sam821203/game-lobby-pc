/* eslint-disable no-unused-vars */
import { defineStore } from "pinia";

export const useGame = defineStore("jump", {
  state: () => ({
    gameUrl: "",
    allGamesType: [
      "crash",
      "slot",
      "fishing",
      "casino",
      "blockchain",
      "bingo",
      "live",
      "poker",
    ],
    studio: "", // pg/facai/jili/joygames
    gameId: null,
    category: null,
  }),
});
