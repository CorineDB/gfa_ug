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

const isAvailable = reactive({
  option: false,
  type: false,
  principe: false,
  critere: false,
  indicateur: true,
  question: false,
});

const currentFactuelFormData = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
});

const dataFactuel = reactive({
  indicateur: {},
});

const getIndicateur = (indicateur) => {
  dataFactuel.indicateur = indicateur;
  currentFactuelFormData.indicateur = indicateur.nom;
};

const currentTab = ref(0);
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-1/3 max-h-screen min-h-screen pr-1 overflow-auto border-r-2 pt-7">
      <AccordionGroup class="space-y-8">
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereGouvernance />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem v-show="currentTab === 0" class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :is-available="isAvailable.indicateur" @selected="getIndicateur" />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem v-show="currentTab === 1" class="!p-0">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Questions opérationnelles</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <QuestionsOperationnel />
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
