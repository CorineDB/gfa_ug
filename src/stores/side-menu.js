import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
      // {
      //   icon: "GridIcon",
      //   pageName: "DashboardGfa",
      //   title: "Dashboard GFA",
      // },
      {
        icon: "FolderIcon",
        pageName: "projets",
        title: "Projets",
        subMenu: [
          {
            icon: "WatchIcon",
            pageName: "ptaGlobal",
            title: "Plan d'action Global",
          },
          {
            icon: "FolderIcon",
            pageName: "projets",
            title: "Projets",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_composantes_globale",
            title: "OutComes",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_sous_composantes_globale",
            title: "OutPut",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_activites_globale",
            title: "Activités",
          },
          {
            icon: "FolderIcon",
            pageName: "dashboard_projets_taches_globale",
            title: "Taches",
          },
        ],
      },
      {
        icon: "FolderIcon",
        title: "Cadre Mesure Rendement",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "create_indicateur",
            title: "Indicateurs",
          },
          {
            icon: "BarChart2Icon",
            pageName: "suivi_indicateur",
            title: "Suivi Indicateurs",
          },
        ],
      },
      {
        icon: "ServerIcon",
        pageName: "audit",
        title: "Audit",
      },
      {
        icon: "ArchiveIcon",
        pageName: "rapport",
        title: "Rapport",
      },
      {
        icon: "FolderIcon",
        title: "Gestion Financière",
        subMenu: [
          {
            icon: "ZapIcon",
            pageName: "finances_suivi",
            title: "Suivi Financier",
          },
          {
            icon: "DollarSignIcon",
            pageName: "Plan_Decaissement",
            title: "Plan de Décaissement",
          },
        ],
      },

      {
        icon: "CpuIcon",
        pageName: "Ongs",
        title: "Organisations",
      },
      {
        icon: "FolderIcon",
        pageName: "projets",
        title: "Outils de collecte",
        subMenu: [
          {
            icon: "SettingsIcon",
            pageName: "create_form_factuel",
            title: "Création Formulaire Factuel",
          },
          {
            icon: "SettingsIcon",
            pageName: "create_form_perception",
            title: "Création Formulaire de Perception",
          },
        ],
      },
      {
        icon: "BarChart2Icon",
        pageName: "Programmation_enquete",
        title: "Évaluations & Résulats",
      },

      {
        icon: "BarChart2Icon",
        pageName: "EnqueteIndividuel",
        title: "Enquête personnalisée",
      },

      {
        icon: "UsersIcon",
        pageName: "Utilisateur",
        title: "Utilisateurs",
      },
      // {
      //   icon: "UnlockIcon",
      //   pageName: "Roles",
      //   title: "Rôles et permissions",
      // },
      {
        icon: "SettingsIcon",
        pageName: "setting",
        title: "Paramètres",
        subMenu: [
          {
            icon: "BarChart2Icon",
            pageName: "sources_verification",
            title: "Sources de vérification",
          },
          {
            icon: "BarChart2Icon",
            pageName: "fonds",
            title: "Fonds",
          },
          // {
          //   icon: "BarChart2Icon",
          //   pageName: "TypeResultat",
          //   title: "Résultats Cadre de rendement",
          // },
          {
            icon: "BarChart2Icon",
            pageName: "Roles",
            title: "Rôles et permissions",
          },
        ],
      },
    ],
  }),
});
