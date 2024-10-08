<template>
  
</template>

<script>

import { mapGetters, mapMutations, mapActions } from "vuex";
import PtabService from "@/services/modules/pta.service.js";

export default {
    components: {
        
    },
    data() {
        return {
            seePta: true,
            seePpm: false,
            openFiltre: false,
            showModal: false,
            reviser: false,
            champsExport: [
                { name: "Date de debut", type: "text", placeholdere: "Selectionnez un indicateur", isSelect: true, isTextArea: false, data: "", required: true, options: ["indicateur1", "indicateur2", "indicateurs3"] },
                { name: "Date de Fin", type: "year", placeholdere: "l'année de base", isSelect: false, isTextArea: false, data: "", required: true },
                { name: "Trimestre", type: "", placeholdere: "Selectionnez le trimestre", isSelect: true, isTextArea: false, data: "", required: true, options: [1, 2, 3, 4] },
                { name: "Bailleurs", type: "", placeholdere: "Selectionnez le bailleur", isSelect: true, isTextArea: false, data: "", required: true, options: ["BM", "BOA"] },
            ],
            isClick: true,
            ptaVisible: false,
            ppmVisible: false,
            cols: 2,
            currentRole: "",
            revisionAdd: false,
            revisionVisible: false,
            ptaVisible: false,
            filtrePta: false,
            filtrePpm: false,
            filtreRePta: false,
            filtreRePpm: false,
            planDecaissementPtaVisible: false,
            ppmVisible: false,
            exporterSuiviPpm: false,
            exporterSuiviPta: false,
            exporterSuiviRePpm: false,
            exporterSuiviRePta: false,
        };
    },
    computed: {
        ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    },

    methods: {
        exportAsExcel() {
            this.showModal = true;
        },
        goPta() {
            this.seePta = true;
            this.seePpm = false;
        },
        goPpm() {
            this.seePta = false;
            this.seePpm = true;
        },
        getPermission() {
            this.currentUser.role[0].permissions.forEach((element) => {
                if (element.slug === "exporter-un-suivi-ppm") {
                    this.exporterSuiviPpm = true;
                }
                if (element.slug === "exporter-un-suivi-ptab") {
                    this.exporterSuiviPta = true;
                }
                if (element.slug === "exporter-un-suivi-ppm") {
                    this.exporterSuiviRePpm = true;
                }
                if (element.slug === "exporter-un-suivi-pta") {
                    this.exporterSuiviRePta = true;
                }
                if (element.slug === "voir-revision-ptab") {
                    this.planDecaissementPtaVisible = true;
                }
                if (element.slug === "exporter-un-suivi-financier") {
                    this.exporterSuiviFinance = true;
                }
                if (element.slug === "voir-ptab") {
                    this.ptaVisible = true;
                }
                if (element.slug === "voir-ppm") {
                    this.ppmVisible = true;
                }
                if (element.slug === "voir-revision-ptab") {
                    this.revisionVisible = true;
                }
                if (element.slug === "faire-revision-ptab") {
                    this.revisionAdd = true;
                }
                if (element.slug === "voir-ptab") {
                    this.filtrePta = true;
                }
                if (element.slug === "voir-ppm") {
                    this.filtrePpm = true;
                }
                if (element.slug === "voir-ptab") {
                    this.filtreRePta = true;
                }
                if (element.slug === "voir-ppm") {
                    this.filtreRePpm = true;
                }
            });
        },

        reviserPta() {
            this.isClick = false;
            const data = {
                programmeId: this.currentUser.programme.id,
            };
            PtabService.reviser(data)
                .then(() => {
                    this.$toast.success("Revision effectué avec success");
                    this.reviser = false;
                    this.isClick = true;
                })
                .catch((e) => {
                    this.$toast.error(e);
                    this.reviser = false;
                    this.isClick = true;
                });
        },
    },
    mounted() {
        this.getPermission();
        if (!this.ptaVisible || !this.ppmVisible) {
            this.$router.push("/401-non-autorise");
        }
        if (this.currentUser != undefined) {
            this.currentRole = this.currentUser.type;
        }
    },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
