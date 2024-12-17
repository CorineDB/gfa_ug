// permissionPlugin.js
export default {
  install(app) {
    app.config.globalProperties.$verifyPermission = function (permission) {
      const userData = localStorage.getItem("authenticateUser");

      if (userData) {
        const permissions = JSON.parse(userData).role[0]?.permissions || [];

        const tab = permissions.filter((item) =>
          permission
            .toLowerCase()
            .split(" ")
            .every((v) => item.slug.toLowerCase().includes(v))
        );

        return tab.length > 0;
      }

      return false;
    };
  },
};
