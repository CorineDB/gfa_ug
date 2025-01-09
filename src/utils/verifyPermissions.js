// Fonction de vérification des permissions
function verifyPermissions(requiredPermissions) {
  // Récupère les données de l'utilisateur depuis le localStorage
  // const userData = JSON.parse(localStorage.getItem("authenticateUser"));

  // Vérifie si les données de l'utilisateur existent et contiennent les permissions
  // if (!userData || !userData.role || !userData.role[0].permissions) {
  //   return false; // Pas de permissions trouvées
  // }

  // const userPermissions = userData.role[0].permissions; // Liste des permissions de l'utilisateur
  const userPermissions = [
    {
      id: "xw2bM6Er6pxWPm8LNw7r3V0Yqo45kvJmdjQXnlgdEKzZA2bDGR1eM9BaP3K91qde",
      nom: "Creer une activite",
      slug: "creer-une-activite",
    },
    {
      id: "3VWMamEN25bkXqgvwL0N73GnRdx86oJAwyQB4AE1pmYDP9alKzMrWeVZzPnQLXv6",
      nom: "Modifier une activite",
      slug: "modifier-une-activite",
    },
    {
      id: "1YXxe5MLeRBvQ0YrAVgzk7alNPKEWdJMNAO4nm689XwGbZ3x521pqLoDMV0Nao49",
      nom: "Supprimer une activite",
      slug: "supprimer-une-activite",
    },
    {
      id: "6DZEWlqb0N6R18olQPgEnBXKrLkxzeOxA5y2ZWV5wp49dAYDabGMmv73q4zmL2ex",
      nom: "Prolonger une activite",
      slug: "prolonger-une-activite",
    },
  ];
  // Vérifie si toutes les permissions requises sont présentes dans celles de l'utilisateur
  return requiredPermissions.every((permission) =>
    userPermissions.some((item) =>
      permission
        .toLowerCase()
        .split(" ")
        .every((word) => item.slug.toLowerCase().includes(word))
    )
  );
}

export default verifyPermissions;
