import verifyPermissions from "./verifyPermissions"; // Importation de la fonction de vérification des permissions

export default {
  // Appelé lorsque l'élément est monté dans le DOM
  mounted(el, binding) {
    
    const requiredPermissions = binding.value; // Récupère les permissions passées en paramètre à la directive
    if (!verifyPermissions(requiredPermissions)) {
      el.style.display = "none"; // Cache l'élément si l'utilisateur n'a pas les permissions requises
    }
  },

  // Appelé lorsque les arguments ou la valeur de la directive changent
  updated(el, binding) {
    const requiredPermissions = binding.value; // Récupère les nouvelles permissions passées
    if (!verifyPermissions(requiredPermissions)) {
      el.style.display = "none"; // Cache l'élément si les permissions sont toujours invalides
    } else {
      el.style.display = ""; // Ré-affiche l'élément si les permissions sont validées
    }
  },
};
