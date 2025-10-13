<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import TabulatorMarqueurClassementFactuel from "../../components/news/TabulatorMarqueurClassementFactuel.vue";
import TabulatorMarqueurClassementPerception from "../../components/news/TabulatorMarqueurClassementPerception.vue";

const router = useRouter();
const route = useRoute();
// Il faudra faire les get des organisationId et enqueteDeCollecteId depuis l'url avec router
const idEvaluation = route.params.e;
const organizationId = ref("");
const idSelectStructure = ref("");
const dataForAllOrganisation = ref([]);
const datasFactuel = ref([]);
const datasPerception = ref([]);
const ongClassements = ref({});
const isLoadingData = ref(false);
const loadingClassement = ref(false);

const getOngClassement = async () => {
  loadingClassement.value = true;
  await SyntheseService.getOngClassement(idEvaluation)
    .then((result) => {
      ongClassements.value = result.data.data;
      loadingClassement.value = false;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des classemnt des organsations.");
    });
};

const currentOrganisation = computed(() => dataForAllOrganisation.value.find((org) => org.id == idSelectStructure.value));
onMounted(async () => {
  getOngClassement();
});
</script>

<template>
  <div class="flex justify-between mt-4 items-center">
    <h2 class="text-lg font-medium intro-y">Classement des organisations par indicateurs</h2>
    <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>

        <TabPanels v-show="!loadingClassement" class="mt-5">
          <!-- Factuel -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">CLASSEMENT DES ORGANISATIONS PAR INDICATEURS (FACTUEL)</div>

            <!-- Tableau de marqueur Factuel -->
            <TabulatorMarqueurClassementFactuel v-if="!loadingClassement" :data="ongClassements.factuel" />
          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">CLASSEMENT DES ORGANISATIONS PAR INDICATEURS (PERCEPTION)</div>
            <!-- Tableau de synthese Perception -->
            <TabulatorMarqueurClassementPerception :data="ongClassements.perception" v-if="!loadingClassement" />
          </TabPanel>
        </TabPanels>
        <LoaderSnipper v-if="loadingClassement" />
      </TabGroup>
    </Preview>
  </PreviewComponent>
</template>

<style scoped>
table td {
  border: 1px solid rgb(0, 0, 0);
}
</style>
