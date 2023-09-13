import { defineStore } from "pinia";

export const useFactuelStore = defineStore("factuel", {
  state: () => ({
    dataTable: [],
  }),
  actions: {
    setDataTable(table) {
      this.dataTable = table;
    },
  },
  getters: {
    getDataTable() {
      return this.dataTable;
    },
  },
});
