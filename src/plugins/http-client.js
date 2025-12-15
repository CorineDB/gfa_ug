import axios from "axios";
//import Vue from 'vue';
import { API_BASE_URL } from "@/services/configs/environment";
import { SET_LOADER, SET_ERRORS_MESSAGE } from "../stores/mutations.type";
import store from "../stores/index";


function determineContentType(payLoad) {
  if (payLoad instanceof FormData) {
    return "multipart/form-data";
  } else {
    return "application/json";
  }
}

const config = {
  baseURL: `${API_BASE_URL}/api/`,
  timeout: 60 * 100000000, // Timeout
  withCredentials: true, // Enable cookies for cross-origin requests
  xsrfCookieName: 'XSRF-TOKEN', // Name of the CSRF cookie
  xsrfHeaderName: 'X-XSRF-TOKEN', // Name of the CSRF header
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, X-Token-Auth, Authorization",
      "X-Requested-With": "XMLHttpRequest", // Required for Sanctum
    },
  },
};


const httpClient = axios.create(config);


const authInterceptor = (config) => {
  let token = store.getters["auths/GET_ACCESS_TOKEN"];
  if (token) {
    token = token.slice(0, -1); // Optionnel : si besoin de modifier le token
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Réinitialisation des erreurs
  store.commit(SET_ERRORS_MESSAGE, { message: null, errors: [] });

  return config;
};



httpClient.interceptors.request.use(authInterceptor);

httpClient.interceptors.response.use(
  (response) => {
    store.commit(SET_LOADER, false); // Désactiver le loader après la réponse
    return response;
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authenticateUser");
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export { httpClient, determineContentType };
