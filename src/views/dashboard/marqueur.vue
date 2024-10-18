<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRouter } from "vue-router";

const router = useRouter();
const organizationId = ref("R5P1oK0OP6DmWGvB21RNoeb9Xpgdwr7PNQ4zy0LAM8KnVZEJa5xlOjYkeWBv8aJy");
const enqueteDeCollecteId = ref("RmLpz4vVan0mOqYvjBE8bVZ3DX7or9yB45RxA6Jp4MGkwlPedKL1z2gQe32BXnE1");
const selectStructureId = ref("");
const datasCollection = ref({});
const datasFactuel = ref([]);
const datasPerception = ref([]);
const structures = ref([]);
const isLoadingData = ref(false);

const getDataCollection = async () => {
  isLoadingData.value = true;
  await SyntheseService.get(enqueteDeCollecteId.value, organizationId.value)
    .then((result) => {
      datasCollection.value = result.data.data;
      datasFactuel.value = datasCollection.value.analyse_factuel;
      datasPerception.value = datasCollection.value.analyse_perception;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      toast.error("Une erreur est survenue: Resultats des synthese .");
    });
};

const getStructure = async () => {
  await SyntheseService.getOrganizations()
    .then((result) => {
      structures.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des structures .");
    });
};

const changeStructure = () => {
  organizationId.value = selectStructureId.value;
  getDataCollection();
};

const getTotalIndicateurs = (principe) => {
  return principe.criteres_de_gouvernance.reduce((total, critere) => {
    return total + critere.indicateurs_de_gouvernance.length;
  }, 0);
};

onMounted(() => {
  //   getDataCollection();
  //   getStructure();
});
</script>

<template>
  <!-- BEGIN: Boxed Tab -->
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE MARQUEUR FACTUEL</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Imprimer</button>
                <Dropdown class="w-1/2 sm:w-auto">
                  <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter CSV </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter JSON </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter XLSX </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter HTML </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                    >
                      <option>Organisation GOB</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>GOB</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/09/2024</td>
                </tr>
              </tbody>
            </table>

            <!-- Figure 3 : Grille de notation des indicateurs de la gouvernance politique -->
            <table class="min-w-full my-6 border border-collapse border-gray-400">
              <thead class="text-white bg-blue-900">
                <tr>
                  <th class="px-4 py-2 border border-gray-400">Principes</th>
                  <th class="px-4 py-2 border border-gray-400">Critères</th>
                </tr>
              </thead>
              <tbody class="font-semibold">
                <!-- Gouvernance politique -->
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400" rowspan="4">Gouvernance politique</td>
                  <td class="px-4 py-2 border border-gray-400">Légitimité/légalité</td>
                </tr>
                <tr class="bg-orange-400">
                  <td class="px-4 py-2 border border-gray-400">Obligation de rendre compte</td>
                </tr>
                <tr class="bg-orange-400">
                  <td class="px-4 py-2 border border-gray-400">Gestion de l'information</td>
                </tr>
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400">Alternance</td>
                </tr>

                <!-- Égalité et non-discrimination -->
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-400" rowspan="3">Égalité et non-discrimination / inclusion</td>
                  <td class="px-4 py-2 border border-gray-400">Imprication des bénéficiaires</td>
                </tr>
                <tr class="bg-orange-400">
                  <td class="px-4 py-2 border border-gray-400">Représentativité</td>
                </tr>
                <tr class="bg-red-600">
                  <td class="px-4 py-2 border border-gray-400">Genre</td>
                </tr>

                <!-- Gouvernance managériale et administrative -->
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-400" rowspan="4">Gouvernance managériale et administrative</td>
                  <td class="px-4 py-2 border border-gray-400">Clarification des rôles et responsabilités</td>
                </tr>
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400">Qualité des services aux bénéficiaires</td>
                </tr>
                <tr class="bg-orange-400">
                  <td class="px-4 py-2 border border-gray-400">Obligation de rendre compte</td>
                </tr>
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400">Gestion de l'information</td>
                </tr>

                <!-- Gouvernance économique et financière -->
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400" rowspan="2">Gouvernance économique et financière</td>
                  <td class="px-4 py-2 border border-gray-400">Clarification des rôles et responsabilités</td>
                </tr>
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400">Obligation de rendre compte</td>
                </tr>

                <!-- Efficacité et efficience -->
                <tr class="bg-red-600">
                  <td class="px-4 py-2 border border-gray-400" rowspan="4">Efficacité et efficience</td>
                  <td class="px-4 py-2 border border-gray-400">Renforcement des capacités</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-400">Planification</td>
                </tr>
                <tr class="bg-yellow-300">
                  <td class="px-4 py-2 border border-gray-400">Suivi-évaluation</td>
                </tr>
                <tr class="bg-red-600">
                  <td class="px-4 py-2 border border-gray-400">Analyse institutionnelle</td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">
            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">FICHE MARQUEUR DE PERCEPTION GOUVERNANCE</div>
            <!-- Figure 8 : grille de notation et de détermination de la moyenne pondérée des questions opérationnelles -->
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Imprimer</button>
                <Dropdown class="w-1/2 sm:w-auto">
                  <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter CSV </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter JSON </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter XLSX </DropdownItem>
                      <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Exporter HTML </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody class="text-black bg-green-400">
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect
                      :options="{
                        placeholder: 'Sélectionner la structure',
                      }"
                      class="w-full"
                    >
                      <option>Organisation GOB</option>
                    </TomSelect>
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>Organisation GOB</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>10/09/2024</td>
                </tr>
              </tbody>
            </table>

            <table class="w-full my-6 border border-collapse border-gray-500 table-auto">
              <thead>
                <tr class="bg-yellow-400">
                  <th colspan="2" class="px-4 py-2 text-center border border-gray-500">INDICE DE PERCEPTION GOUVERNANCE</th>
                </tr>
              </thead>
              <tbody class="font-semibold">
                <!-- Redévabilité -->
                <tr class="text-white bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Redévabilité</td>
                  <td class="px-4 py-2 border border-gray-500"></td>
                </tr>
                <tr class="bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Qap1</td>
                  <td class="px-4 py-2 border border-gray-500">Les rôles et responsabilités des organes de gestion sont clairement définis</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap2</td>
                  <td class="px-4 py-2 border border-gray-500">Les différentes instances de prise de décision de l'organisation jouent pleinement leur rôle</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap3</td>
                  <td class="px-4 py-2 border border-gray-500">La mission, les objectifs et les actions de l’organisation sont en adéquation avec les besoins de ses bénéficiaires</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap4</td>
                  <td class="px-4 py-2 border border-gray-500">Les bénéficiaires connaissent la mission et les objectifs de l’organisation</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap5</td>
                  <td class="px-4 py-2 border border-gray-500">Les instances de prise de décision rendent régulièrement compte</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap6</td>
                  <td class="px-4 py-2 border border-gray-500">Les services aux bénéficiaires sont conformes aux normes de qualité</td>
                </tr>

                <!-- Transparence -->
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Transparence</td>
                  <td class="px-4 py-2 border border-gray-500"></td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap7</td>
                  <td class="px-4 py-2 border border-gray-500">Les procédures de passation de marché de l'organisation sont transparentes, connues de tous et encouragent la compétitivité</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap8</td>
                  <td class="px-4 py-2 border border-gray-500">L'information est accessible à tous au sein de l'organisation</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap9</td>
                  <td class="px-4 py-2 border border-gray-500">Les processus de prise de décision au sein de l'organisation sont transparents</td>
                </tr>

                <!-- Participation -->
                <tr class="text-white bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Participation</td>
                  <td class="px-4 py-2 border border-gray-500"></td>
                </tr>
                <tr class="bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Qap10</td>
                  <td class="px-4 py-2 border border-gray-500">Toutes les parties prenantes sont représentées au niveau des instances de prise de décision de l'organisation</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap11</td>
                  <td class="px-4 py-2 border border-gray-500">Les organes de gestion de l'organisation sont régulièrement renouvelés</td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap12</td>
                  <td class="px-4 py-2 border border-gray-500">L'avis des bénéficiaires est pris en compte par l'organisation</td>
                </tr>

                <!-- Efficacité et efficience -->
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Efficacité et efficience</td>
                  <td class="px-4 py-2 border border-gray-500"></td>
                </tr>
                <tr class="bg-green-400">
                  <td class="px-4 py-2 border border-gray-500">Qap13</td>
                  <td class="px-4 py-2 border border-gray-500">L'organisation dispose d'un plan stratégique</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap14</td>
                  <td class="px-4 py-2 border border-gray-500">Les actions de l'organisation impactent positivement les bénéficiaires</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap15</td>
                  <td class="px-4 py-2 border border-gray-500">L'organisation a une bonne capacité de mobilisation des ressources financières (propres et externes)</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap16</td>
                  <td class="px-4 py-2 border border-gray-500">Les discours tenus par les membres de l'organisation sont en cohérence avec les actions posées</td>
                </tr>

                <!-- Égalité et inclusion sociale -->
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Égalité et inclusion sociale</td>
                  <td class="px-4 py-2 border border-gray-500"></td>
                </tr>
                <tr class="text-white bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Qap17</td>
                  <td class="px-4 py-2 border border-gray-500">Le genre est pris en compte au niveau du Conseil d'Administration</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap18</td>
                  <td class="px-4 py-2 border border-gray-500">Le genre est pris en compte au niveau de l'Assemblée Générale de l'association</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap19</td>
                  <td class="px-4 py-2 border border-gray-500">Les femmes occupent des postes de responsabilité au sein de l'association</td>
                </tr>
                <tr class="bg-yellow-400">
                  <td class="px-4 py-2 border border-gray-500">Qap20</td>
                  <td class="px-4 py-2 border border-gray-500">La qualité de traitement des travailleurs est équitable</td>
                </tr>
                <tr class="bg-red-500">
                  <td class="px-4 py-2 border border-gray-500">Qap21</td>
                  <td class="px-4 py-2 border border-gray-500">Tous sont traités de façon équitable et sans aucune forme de discrimination</td>
                </tr>
              </tbody>
            </table>
            <!-- <LoaderSnipper v-else /> -->
            <!-- <h2 class="py-4 mr-5 text-lg font-medium">Indice de Gouvernace</h2>

            <table class="w-full mb-12 border-collapse table-auto" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="text-white border-t border-white bg-slate-600">
                  <th class="p-2 text-left" _colspan="11">Principes</th>
                  <th class="p-2 text-center">Indice de Perception</th>
                  <th class="p-2 text-center">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr class="font-bold text-white bg-blue-900 border-t-8 border-white">
                  <td class="px-2" colspan="12">Gouvernance politique</td>
                </tr>
                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Redevabilité</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Transparence</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Participation</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1 font-medium bg-sky-500">Egalité et non-discrimination / inclusion</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>
              </tbody>
            </table> -->
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Preview>
  </PreviewComponent>
  <!-- END: Boxed Tab -->
</template>

<style scoped>
table td {
  border: 1px solid rgb(109, 109, 109);
}
</style>
