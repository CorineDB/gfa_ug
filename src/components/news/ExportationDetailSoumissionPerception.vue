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
    filterOptions: {
      type: Array,
      required: true,
      default: [],
    },
  },

  methods: {
    async generateExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("DETAIL_SOUMISSION_PERCEPTION");

      // Ajuster la largeur des colonnes
      worksheet.columns = [
        { header: "Principes", width: 30 }, // Colonne Principes
        { header: "Questions opérationnelles", width: 100 }, // Colonne plus large pour les questions
        ...this.filterOptions.map((option) => ({ header: option.libelle, width: 17 })), // Options
      ];

      // Ajouter l'en-tête avec style
      const headerRow = worksheet.getRow(1);
      headerRow.values = ["Principes", "Questions opérationnelles", ...this.filterOptions.map((option) => option.libelle)];
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "002060" }, // Bleu foncé
        };
        cell.font = { color: { argb: "FFFFFF" }, bold: true }; // Texte blanc et gras
        cell.alignment = { vertical: "middle", horizontal: "center" }; // Centré
        // cell.border = {
        //   top: { style: "thin" },
        //   left: { style: "thin" },
        //   bottom: { style: "thin" },
        //   right: { style: "thin" },
        // };
      });

      // Ajouter les données
      let currentRowNumber = 2; // Commence après l'en-tête
      this.filterSoumission.forEach((principe) => {
        if (principe.questions_de_gouvernance.length > 0) {
          principe.questions_de_gouvernance.forEach((question, index) => {
            const row = worksheet.getRow(currentRowNumber);

            // Si c'est la première question, ajouter le principe
            if (index === 0) {
              row.getCell(1).value = principe.nom;
              row.getCell(1).font = { bold: true }; // Mettre en gras
              row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }; // Centré
            }

            // Ajouter la question
            row.getCell(2).value = question.nom;
            row.getCell(2).alignment = { vertical: "middle", horizontal: "left" }; // Aligné à gauche

            // Ajouter les réponses pour les options
            this.filterOptions.forEach((option, optionIndex) => {
              const cellIndex = 3 + optionIndex; // Les colonnes commencent après Principes et Questions
              row.getCell(cellIndex).value = question.reponse_de_la_collecte?.optionDeReponseId === option.id ? "✔️" : "";
              row.getCell(cellIndex).alignment = { vertical: "middle", horizontal: "center" }; // Centré
            });

            // Appliquer des bordures
            // row.eachCell((cell) => {
            //   cell.border = {
            //     top: { style: "thin" },
            //     left: { style: "thin" },
            //     bottom: { style: "thin" },
            //     right: { style: "thin" },
            //   };
            // });

            currentRowNumber++;
          });
        }
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `DETAIL_SOUMISSION_PERCEPTION${date}.xlsx`);
    },
  },
};
</script>
