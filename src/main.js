import "@fullcalendar/core/vdom";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import store from "./stores";
import globalComponents from "./global-components";
import utils from "./utils";
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import "./assets/css/app.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import permissionPlugin from "./plugins/verify-permission";
import permissionDirective from "./utils/permissionsDirective";
import JsonExcel from "vue-json-excel3";
import phoneValidator from "./plugins/phoneValidator";

// import '@vueform/vueform/themes/vueform/css/index.css'

//import { Vue3SimpleHtml2pdf } from "vue3-simple-html2pdf";

const app = createApp(App)
  .use(router)
  .use(createPinia())
  .use(store)
  .use(Vue3Toastify, {
    autoClose: 3000,
  })
  .use(permissionPlugin)
  .use(phoneValidator);

globalComponents(app);
utils(app);
app.component("v-select", vSelect);
app.component("downloadExcel", JsonExcel);
app.directive("permission", permissionDirective);
app.mount("#app");
