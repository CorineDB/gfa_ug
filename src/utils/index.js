import faker from "./faker";
import helper from "./helper";
import lodash from "./lodash";
import colors from "./colors";

//new
import formatDate from './date-format'
import extractFormData from './extract-data'
import pluck from './pluck'
import cigle from './get-cigle'
import sortBy from './sort-data'

const getStringValueOfStatutCode = (statut) => {

    let data = {
        "code": statut,
        "libelle": "Statut code inconnu",
        "couleur": "bg-blue-500"
    };

    switch (statut) {
        case -2:

            data = {
                "code": statut,
                "libelle": "Non validé",
                "couleur": "bg-black-500"
            };
            break;

        case -1:
            data = {
                "code": statut,
                "libelle": "En attente",
                "couleur": "bg-gray-700"
            };
            break;

        case 0:
            data = {
                "code": statut,
                "libelle": "En cours",
                "couleur": "bg-yellow-400"
            };
            break;

        case 1:
            data = {
                "code": statut,
                "libelle": "En retard",
                "couleur": "bg-red-500"
            };
            break;


        case 2:
            data = {
                "code": statut,
                "libelle": "Terminé",
                "couleur": "bg-green-400"
            };
            break;

        default:
            data;
            break;
    }

    return data;
};


export {
    cigle,
    extractFormData,
    formatDate,
    pluck,
    sortBy,
    getStringValueOfStatutCode
}

export default (app) => {
    app.use(faker);
    app.use(helper);
    app.use(lodash);
    app.use(colors);
};