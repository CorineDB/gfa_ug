<script setup>
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import CritereGouvernance from "@/components/create-form/CritereGouvernance.vue";
import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import QuestionsOperationnel from "@/components/create-form/QuestionsOperationnel.vue";
import { reactive } from "vue";
import { ref } from "vue";
import FactuelStructure from "../../components/create-form/FactuelStructure.vue";
import { computed } from "vue";

const tabs = [
  {
    label: "FORMULAIRE FACTUEL",
    key: 0,
  },
  {
    label: "FORMULAIRE DE PERCEPTION",
    key: 1,
  },
];

const currentTab = ref(0);
const indexAccordion = ref(1);
const resetCurrentForm = ref(false);
const formFactuelData = ref([]);
const formData = ref([]);

const isAvailable = reactive({
  option: true,
  type: true,
  principe: true,
  critere: true,
  indicateur: true,
  question: true,
});

const currentFactuelFormData = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
});

const dataFactuel = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
});

const resetCurrentFactuelFormData = () => {
  Object.keys(currentFactuelFormData).forEach((key) => {
    currentFactuelFormData[key] = "";
  });
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
};

const getType = (type) => {
  changeIndexAccordion(1);
  dataFactuel.type = type.id;
  currentFactuelFormData.type = type.nom;
};

const getPrincipe = (principe) => {
  changeIndexAccordion(5);
  dataFactuel.principe = principe.id;
  currentFactuelFormData.principe = principe.nom;
};

const getCritere = (critere) => {
  changeIndexAccordion(4);
  dataFactuel.critere = critere.id;
  currentFactuelFormData.critere = critere.nom;
};

const getIndicateur = (indicateur) => {
  changeIndexAccordion(3);
  dataFactuel.indicateur = indicateur.id;
  currentFactuelFormData.indicateur = indicateur.nom;
};

const getQuestion = (question) => {
  dataFactuel.question = question.id;
  currentFactuelFormData.question = question.nom;
};

const addIndicateur = () => {
  formFactuelData.value.unshift({ ...currentFactuelFormData });
  resetCurrentFactuelFormData();
  resetCurrentForm.value = !resetCurrentForm.value;
};

const isCurrentFormValid = computed(() => {
  return Object.values(currentFactuelFormData).every((value) => value.trim() !== "");
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-1/3 max-h-screen min-h-screen pr-1 overflow-auto border-r-2 pt-7">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-8">
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem v-show="currentTab === 0" class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur" @selected="getIndicateur" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem v-show="currentTab === 1" class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Questions opérationnelles</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <QuestionsOperationnel :to-reset="resetCurrentForm" :is-available="isAvailable.question" @selected="getIndicateur" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.critere" @selected="getCritere" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.principe" @selected="getPrincipe" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.type" @selected="getType" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-2/3 pt-5">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="currentTab = tab.key" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2" tag="button">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <FactuelStructure :type="currentFactuelFormData.type" :principe="currentFactuelFormData.principe" :critere="currentFactuelFormData.critere" :indicateur="currentFactuelFormData.indicateur" />
            <!-- <button :disabled="!isCurrentFormValid" @click="addIndicateur" class="my-4 text-sm btn btn-primary">Ajouter l'indicateur</button>
            {{ formFactuelData }}
            <br />
            --------------------------------------------------------------------------------------------
            {{ currentFactuelFormData }} -->
          </TabPanel>
          <TabPanel class="leading-relaxed"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>
</template>

<style>
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}
</style>
