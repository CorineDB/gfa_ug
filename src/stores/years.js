import { defineStore } from "pinia";

export const useYearsStore = defineStore("years", {
  state: () => ({
    years: [],
  }),
  actions: {
    setYears(year) {
      this.years = year;
    },
  },
  getters: {
    getYears() {
      return this.years;
    },
  },
});
