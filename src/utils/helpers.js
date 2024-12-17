import { v4 as uuidv4 } from "uuid";

export function generateUniqueId() {
  let uniqueId = localStorage.getItem("clientId");
  if (!uniqueId) {
    uniqueId = uuidv4(); // Générer un nouvel UUID si l'ID n'existe pas
    localStorage.setItem("clientId", uniqueId); // Sauvegarder l'ID pour les sessions suivantes
  }
  return uniqueId;
}

export function generateUniqueIdSurvey() {
  let uniqueId = localStorage.getItem("surveyClientId");
  if (!uniqueId) {
    uniqueId = uuidv4(); // Générer un nouvel UUID si l'ID n'existe pas
    localStorage.setItem("surveyClientId", uniqueId); // Sauvegarder l'ID pour les sessions suivantes
  }
  return uniqueId;
}
export function generatevalidateKey(key) {
  localStorage.setItem(key, "true");
}
export function getvalidateKey(key) {
  return localStorage.getItem(key);
}
// Fonction pour créer un identifiant unique
// export function createUniqueId() {
//   const userAgent = navigator.userAgent;
//   const language = navigator.language;
//   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   const randomUUID = crypto.randomUUID(); // Génère un UUID unique

//   // Combiner les informations et générer un hash simple
//   return `${userAgent}-${language}-${timezone}-${randomUUID}`;
// }

export const getFieldErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return "";
  return errors.join(", ");
};

export function verifyPermission(permission) {
  if (JSON.parse(localStorage.getItem("authenticateUser"))) {
    var permissions = JSON.parse(localStorage.getItem("authenticateUser")).role[0].permissions;
  }
  var tab = permissions
    ? permissions.filter((item) => {
        return permission
          .toLowerCase()
          .split(" ")
          .every((v) => item.slug.toLowerCase().includes(v));
      })
    : [];

  return tab.length > 0;
}
