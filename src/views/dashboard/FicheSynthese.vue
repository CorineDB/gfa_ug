<script setup>



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


            <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">
              FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE
            </div>

            <table class="w-full mt-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    <TomSelect v-model="select" :options="{
                      placeholder: 'Sélectionner la structure',
                    }" class="w-full">
                      <option value="1">Leonardo DiCaprio</option>
                      <option value="2">Johnny Deep</option>
                      <option value="3">Robert Downey, Jr</option>
                      <option value="4">Samuel L. Jackson</option>
                      <option value="5">Morgan Freeman</option>
                    </TomSelect>
                    <!-- <div class="">
                      <TomSelect id="crud-form-2" v-model="categories" class="w-full" multiple>
                        <option value="1">Sport & Outdoor</option>
                        <option value="2">PC & Laptop</option>
                        <option value="3">Smartphone & Tablet</option>
                        <option value="4">Photography</option>
                      </TomSelect>
                    </div> -->
                    <!-- <Dropdown class="w-full md:ml-auto md:mt-0">
                      <DropdownToggle class="w-full font-normal text-left btn btn-outline-secondary">
                        {{ selectedIndicateur.name }}
                        <ChevronDownIcon class="w-4 h-4 ml-2" />
                      </DropdownToggle>
                      <DropdownMenu class="w-40">
                        <DropdownContent class="h-32 overflow-y-auto">
                          <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
                            @click="choixIndicateur(indicateurOfCampagne)">
                            {{
                              indicateurOfCampagne.nom }}</DropdownItem>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown> -->
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td>Lorem ipsum dolor sit.</td>
                </tr>
              </tbody>
            </table>

            <table class="w-full mt-12 text-sm border-collapse table-auto">
              <thead class="text-left bg-green-200">
                <tr>
                  <th class="pl-2">Principe</th>
                <th>Indice Factuel</th>
                </tr>
                
              </thead>
              <tbody>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Redevabilité</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Transparence</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Participation</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Egalité et non-discrimination / inclusion</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Efficacité et efficience</td>
                  <td>0.56</td>
                </tr>
              </tbody>
            </table>


            <!-- Figure 3 : Grille de notation des indicateurs de la gouvernance politique -->
            <table class="w-full my-12 border-collapse table-auto" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="">
                  <th class="p-2 my-2 bg-yellow-300" _colspan="5">Indice factuel de Gouvernance politique (IFGP)</th>
                  <th class="p-2 text-center bg-yellow-300">0.59</th>
                </tr>
                <!-- <tr class="border-t-8 border-white bg-slate-200">
                  <th class="p-2 my-2" _colspan="5">Score Factuel Redevabilité</th>
                  <th class="p-2 text-center">0.59</th>
                </tr> -->
              </thead>

              <tbody class="bg-white ">
                <tr class="font-bold border-t-8 border-white bg-slate-200">
                  <td class="p-2">Score Factuel Redevabilité</td>
                  <td class="p-2 text-center">0.59</td>
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Rôles et responsabilité clairement définis</td>
                  <!-- <td class="p-2 text-center">10</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1 ">Organes statutaires fonctionnels</td>
                  <!-- <td class="p-2 text-center">15</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Existence de statuts et règlement intérieur</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Rédaction et validation des rapports d’activités</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>

                <!-- row 2 -->
                <tr class="font-bold border-t-8 border-white bg-slate-200">
                  <td class="p-2">Score Factuel Transparence</td>
                  <td class="p-2 text-center">0.59</td>
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Informations accessibles</td>
                  <!-- <td class="p-2 text-center">10</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1 ">Rapports publiés</td>
                  <!-- <td class="p-2 text-center">15</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Procédures de prise de décision formalisées</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Procédures de prise de décision respectées</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
              </tbody>
            </table>

            <!-- <table class="w-full mt-12 border-collapse table-auto" border="0" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr>
                  <th scope="col" class="p-2 text-white">Principes</th>
                  <th scope="col" class="p-2 text-white">Critères</th>
                  <th scope="col" class="w-full p-2 text-white">Indicateurs</th>
                  <th scope="col" class="p-2 text-white whitespace-nowrap">Réponse <br>(Oui / Non)</th>
                  <th scope="col" class="p-2 text-white">Note</th>
                  <th scope="col" class="p-2 text-white whitespace-nowrap">Sources de vérification</th>
                </tr>
                <tr class="bg-white border-t-8 border-white">
                  <th class="p-2 my-2 text-center bg-yellow-300" colspan="5">INDICE FACTUEL DE GOUVERNANCE</th>
                  <th class="p-2 text-center bg-yellow-300">0.59</th>
                </tr>
                <tr class="bg-white border-t-8 border-white">
                  <th class="p-2 my-2 bg-yellow-300" colspan="5">Gouvernance politique</th>
                  <th class="p-2 text-center bg-yellow-300">0.59</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="p-2 font-bold bg-yellow-500" rowspan="5">Redevabilité</td>
                  <td class="p-2 bg-yellow-500" rowspan="4">Légitimité/légalité</td>
                  <td class="p-2 bg-green-600">Rôles et responsabilité clairement définis</td>
                  <td class="p-2 text-center bg-green-600">1</td>
                  <td class="p-2 bg-green-600">10</td>
                </tr>
                <tr class="text-white bg-red-600">
                  <td class="p-2 ">Organes statutaires fonctionnels</td>
                  <td class="p-2 text-center">2</td>
                  <td class="p-2">15</td>
                </tr>
                <tr class="bg-yellow-500">
                  <td class="p-2">Existence de statuts et règlement intérieur</td>
                  <td class="p-2 text-center">3</td>
                  <td class="p-2">6</td>
                </tr>
                <tr class="bg-green-500">
                  <td class="p-2">Rédaction et validation des rapports d’activités</td>
                  <td class="p-2 text-center">3</td>
                  <td class="p-2">6</td>
                </tr>
                <tr class="font-bold bg-yellow-500 ">
                  <td colspan="2" class="px-2"></td>
                  <td class="px-2 text-xs whitespace-nowrap">Score Factuel</td>
                  <td class="px-2">0.43</td>
                </tr>

              </tbody>
            </table> -->

          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">

            <!-- Figure 8 : grille de notation et de détermination de la moyenne pondérée des questions opérationnelles -->
            <table class="w-full mb-12 border-collapse table-auto" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="">
                  <th class="p-2 my-2 text-center text-white bg-blue-900" colspan="12">Pondérations</th>
                </tr>
                <tr class="text-white bg-blue-900 border-t-2 border-white">
                  <th class="p-2 my-2 text-center" rowspan="2">Questions opérationnelles</th>
                  <th class="p-2 my-2 text-center" colspan="2">Pas du tout</th>
                  <th class="p-2 my-2 text-center" colspan="2">Faiblement</th>
                  <th class="p-2 my-2 text-center" colspan="2">Moyennement</th>
                  <th class="p-2 my-2 text-center" colspan="2">Dans une grande mesure</th>
                  <th class="p-2 my-2 text-center" colspan="2">Totalement</th>
                  <th class="p-2 my-2 text-center" rowspan="2">Moyenne pondérée</th>
                </tr>
                <tr class="text-white bg-blue-900 border-t border-white">
                  <th class="p-2 text-center">Note(a)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (a')</th>
                  <th class="p-2 text-center">Note(b)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (b')</th>
                  <th class="p-2 text-center">Note(c)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (c')</th>
                  <th class="p-2 text-center">Note(d)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (d')</th>
                  <th class="p-2 text-center">Note(e)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (e')</th>
                </tr>
                <tr class="text-white bg-red-600 border-t border-white">
                  <th class="p-2 text-center" colspan="11">Moyenne pondérée</th>
                  <th class="p-2 text-center">0.76</th>
                </tr>
              </thead>

              <tbody class="bg-white ">
                <tr class="font-bold bg-blue-200 border-t-8 border-white ">
                  <td class="px-2 " colspan="12">Redevabilité</td>
                </tr>
                <tr class="pb-2 border-b border-l-2">
                  <td class="px-4 py-1">Rôles et responsabilité clairement définis</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>

                <!-- row 2 -->
                <tr class="border-b border-l-2">
                  <td class="px-4 py-1">Les différentes instances de prise de décision de l’organisation jouent pleinement
                    leur rôle</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>
                <!-- row 3 -->
                <tr class="border-l-2">
                  <td class="px-4 py-1">Les différentes instances de prise de décision de l’organisation jouent pleinement
                    leur rôle</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>

              </tbody>
            </table>

            <h2 class="py-4 mr-5 text-lg font-medium">Indice de Gouvernace</h2>

            <table class="w-full mb-12 border-collapse table-auto" cellpadding="0" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="text-white border-t border-white bg-slate-600">
                  <th class="p-2 text-left" _colspan="11">Principes</th>
                  <th class="p-2 text-center">Indice de Perception</th>
                  <th class="p-2 text-center">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class="bg-white ">
                <tr class="font-bold text-white bg-blue-900 border-t-8 border-white ">
                  <td class="px-2 " colspan="12">Gouvernance politique</td>
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
            </table>



          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Preview>

  </PreviewComponent>
  <!-- END: Boxed Tab -->
</template>
