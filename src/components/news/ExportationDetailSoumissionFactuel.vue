<template>
  <div>
    <button class="btn btn-outline-primary" @click="generateExcel"><FileTextIcon class="w-4 h-4 mr-2" />Exporter Excel</button>
  </div>
</template>

<script>
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default {
  props: {
    filterSoumission: {
      type: Array,
      required: true,
      default: {},
    },
  },

  methods: {
    async generateExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("DETAIL_SOUMISSION_FACTUEL");

      // Définir les colonnes
      worksheet.columns = [
        { header: "Principes", width: 35 },
        { header: "Critères", width: 30 },
        { header: "Indicateurs", width: 80 },
        { header: "Réponses", width: 20 },
        { header: "Note", width: 10 },
        { header: "Source de validation", width: 25 },
      ];

      // Styliser l'en-tête
      const headerRow = worksheet.getRow(1);
      headerRow.values = ["Principes", "Critères", "Indicateurs", "Réponses", "Note", "Source de validation"];
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "002060" },
        };
        cell.font = { color: { argb: "FFFFFF" }, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Ajouter les données
      let currentRowNumber = 2;
      const mergedRanges = new Set(); // Utiliser un ensemble pour suivre les plages fusionnées

      this.filterSoumission.forEach((principe) => {
        // Ajouter une ligne pour le principe (fusionner toutes les colonnes)
        const principeRow = worksheet.getRow(currentRowNumber++);
        principeRow.getCell(1).value = principe.nom;
        principeRow.getCell(1).font = { bold: true };
        principeRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        // Vérifier avant de fusionner
        // Fusionner uniquement si la plage n'a pas encore été fusionnée
        // const mergeRange = `A${principeRow.number}:F${principeRow.number}`;
        // if (!mergedRanges.has(mergeRange)) {
        //   worksheet.mergeCells(mergeRange);
        //   mergedRanges.add(mergeRange); // Ajouter la plage fusionnée à l'ensemble
        // }
        // Parcourir les catégories
        principe.categories_de_gouvernance.forEach((categorie) => {
          const totalQuestions = categorie.categories_de_gouvernance.reduce((sum, sc) => sum + sc.questions_de_gouvernance.length, 0);

          let categoryRowStart = currentRowNumber;

          categorie.categories_de_gouvernance.forEach((sousCategorie) => {
            sousCategorie.questions_de_gouvernance.forEach((question, qIndex) => {
              const questionRow = worksheet.getRow(currentRowNumber++);

              // Ajouter la catégorie principale avec rowspan
              if (currentRowNumber - categoryRowStart === 1) {
                questionRow.getCell(1).value = categorie.nom;
                questionRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

                // Vérifiez si les cellules sont déjà fusionnées avant d'appeler mergeCells
                const mergeRange = `A${categoryRowStart}:A${categoryRowStart + totalQuestions - 1}`;
                if (!worksheet._merges[mergeRange]) {
                  worksheet.mergeCells(mergeRange);
                }
              }

              // Ajouter la sous-catégorie avec rowspan
              if (qIndex === 0) {
                questionRow.getCell(2).value = sousCategorie.nom;
                questionRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

                const subCategoryRange = `B${currentRowNumber}:B${currentRowNumber + sousCategorie.questions_de_gouvernance.length - 1}`;
                if (!worksheet._merges[subCategoryRange]) {
                  worksheet.mergeCells(subCategoryRange);
                }
              }

              // Ajouter les données des questions
              questionRow.getCell(3).value = question.nom;
              questionRow.getCell(4).value = question.reponse_de_la_collecte?.nom || "";
              questionRow.getCell(5).value = question.reponse_de_la_collecte.point;
              questionRow.getCell(6).value = question.reponse_de_la_collecte?.sourceDeVerification || "";

              // Styliser les cellules
              questionRow.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
              });
            });
          });
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `DETAIL_SOUMISSION_FACTUEL${date}.xlsx`);
    },
  },
};
</script>
