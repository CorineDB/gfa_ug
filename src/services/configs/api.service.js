import { httpClient, determineContentType } from "@/plugins/http-client";
const ApiService = {
  query(resource, params) {
    return httpClient.get(resource, params).catch((error) => {
      // throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    return new Promise(async (resolve, reject) => {
      if (slug == "" || slug == null) {
        await httpClient
          .get(`${resource}`)
          .then((response, status) => resolve(response, status))
          .catch((response, status) => {
            reject(response, status);
          });
      } else {
        await httpClient
          .get(`${resource}/${slug}`)
          .then((response, status) => resolve(response, status))
          .catch((response, status) => {
            reject(response, status);
          });
      }
    });
  },

  post(resource, params) {
    return new Promise(async (resolve, reject) => {
      const contentType = determineContentType(params);

      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
      };

      const requestConfig = {
        headers,
      };

      await httpClient
        .post(`${resource}`, params, requestConfig)
        .then((response, status) => {
          resolve(response, status);
        })
        .catch((response, status) => {
          
          reject(response, status);
        });
    });
  },

  update(resource, slug, params) {
    return new Promise(async (resolve, reject) => {
      const contentType = determineContentType(params);

      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
      };

      const requestConfig = {
        headers,
      };

      await httpClient
        .put(`${resource}/${slug}`, params, requestConfig)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },

  put(resource, params) {
    return new Promise(async (resolve, reject) => {
      const contentType = determineContentType(params);

      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
      };

      const requestConfig = {
        headers,
      };

      await httpClient
        .put(`${resource}`, params, requestConfig)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },

  delete(resource) {
    return new Promise(async (resolve, reject) => {
      await httpClient
        .delete(resource)
        .then((response, status) => resolve(response, status))
        .catch((response, status) => {
          reject(response, status);
        });
    });
  },
};

export default ApiService;
