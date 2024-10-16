<template>
 


  <div style="height: 80vh" class="flex overflow-y-auto relative">
          <div style="width: 33.33%; position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
            <table class="top-0 left-0 w-full border-collaspe table-fixed block table1 text-left text-sm">
              <thead class="text-xs sticky z-20 top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr style="height: 82px" class="">
                  <th rowspan="2" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Organisation</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Code PTBA</th>
                  <!-- <th scope="col" rowspan="2" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Etat des taches</th> -->
                </tr>
                <tr></tr>
              </thead>

              <tbody>
                <tr v-for="pta in tabPtab" :key="pta.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ pta.owner_nom }}
                  </th>
                  <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.isProjet" class="font-bold text-lg"> {{ pta.code }}</span>
                    <span v-if="pta.isComposante" class="text-blue-500 text-sm"> {{ pta.code }}</span>
                    <span v-if="pta.isSC && pta.code != 0" class="text-yellow-600 text-sm"> {{ pta.code }}</span>
                    <span v-if="pta.isActivite" class="text-green-600 text-sm"> {{ pta.code }}</span>
                    <span v-if="pta.isTache" class="text-red-600 text-sm"> {{ pta.code }}</span>
                  </td>
                  <!-- <td>
                    <button
                      v-if="pta.isTache"
                      @click="togglesuivie(pta)"
                      class="text-white rounded-full w-14 h-7 px-1 flex items-center justify-between transition-all shadow"
                      :class="{
                        'bg-gray-400': false,
                        'bg-red-400': pta.poidsActuel == 0 || tabletoggle[pta.id] == 0,
                        'bg-green-400 ': greentoggle && (pta.poidsActuel > 0 || tabletoggle[pta.id] == 1),
                      }">
                      <div
                        class="w-5 h-5 bg-white rounded-full transform translate-x-0"
                        :class="{
                          'translate-x-full': pta.poidsActuel > 0 || translatetoggle || tabletoggle[pta.id] == 1,
                        }"></div>
                    </button>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>

          <div class="absolute perso left-96 shadow-md sm:rounded-lg">
            <table class="w-full overflow-auto text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs sticky _z-20 top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr class="">
                  <th scope="col" rowspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Composantes / Sous-composantes / activiés / Taches</th>
                  <th scope="col" colspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Montant projet XOF</th>
                  <th scope="col" colspan="3" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant budgetisé XOF</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Poids</th>
                  <th v-if="statutActuel" scope="col" rowspan="2" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">poids actuel</th>

                  <th scope="col" rowspan="2" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">STRUCTURE ASSOCIER</th>
                  <th scope="col" rowspan="2" class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">STRUCTURE RESPONSABLE</th>
                  <th scope="col" colspan="12" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">PLANING</th>
                  <th scope="col" colspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TRIMESTRE 1</th>

                  <th scope="col" colspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TRIMESTRE 2</th>

                  <th scope="col" colspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TRIMESTRE 3</th>

                  <th scope="col" colspan="3" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TRIMESTRE 4</th>
                </tr>

                <tr class="">
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">JAV</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">FEV</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">MARS</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">AVRIL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">MAI</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">JUIN</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">JUILLET</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">AOUT</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">SEPTEMBRE</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">OCTOBRE</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">NOVEMBRE</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">DECEMBRE</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">BN XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">EMP XOF</th>
                  <th scope="col" class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TOTAL</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="pta in dataNew" :key="pta.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.isProjet" class="font-bold text-lg">projet: {{ pta.nom }}</span>
                    <span v-if="pta.isComposante" class="text-blue-500 text-sm">Composante: {{ pta.nom }}</span>
                    <span v-if="pta.isSC" class="text-yellow-600 text-sm"> <span class="text-yellow-600 text-sm" v-if="pta.code != 0">Sous composante:</span> {{ pta.nom }}</span>
                    <span v-if="pta.isActivite" class="text-green-600 text-sm bg-gradient-to-br from-yellow-400 to-yellow-600 shadow">Activite: {{ pta.nom }}</span>
                    <span v-if="pta.isTache" class="text-red-600 text-sm"> {{ pta.nom }}</span>
                  </td>
                  <td v-if="pta.bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.bn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.pret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold text-green-500"> {{ pta.pret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.pret != '' || pta.bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold text-yellow-500"> {{ (pta.pret + pta.bn) | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <!-- total budgetaire-->

                  <td v-if="pta.tBn != undefined && pta.tBn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.tBn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.tPret != undefined && pta.tPret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 text-green-500 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.tPret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.total != undefined && pta.total != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.total | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.poids != undefined" class="font-bold"> {{ pta.poids }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td v-if="statutActuel" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.poidsActuel != undefined" class="font-bold text-green-500"> {{ pta.poidsActuel }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>

                  <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.structureAssocie != undefined" class="font-bold"> {{ pta.structureAssocie }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.structureResponsable != undefined" class="font-bold"> {{ pta.structureResponsable }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>

                  <!--  Planing vrai activité-->

                  <td v-if="pta.planing != undefined && pta.planing.janvier != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.janvier != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700 shadow" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.fevrier != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.fevrier != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.mars != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.mars != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.avril != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.avril != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.mai != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.mai != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.juin != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.juin != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.juillet != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.juillet != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>

                  <td class="p-2 whitespace-nowrap border relative dark:bg-yellow-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.aout != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.aout != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.septembre != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.septembre != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.octobre != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.octobre != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.novembre != ''" class="p-2 border bg-gradient-to-br from-blue-400 to-blue-600 shadow border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.novembre != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.planing != undefined && pta.planing.decembre != ''" class="p-2 border bg-blue-500 border-l-0 border-r-0"></td>
                  <td v-else-if="pta.planingt != undefined && pta.planingt.decembre != ''" class="p-2 border bg-gradient-to-br from-red-400 to-red-600 shadow border-l-0 border-r-0"></td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <!--  planing -->

                  <td v-if="pta.t1Bn != undefined && pta.t1Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t1Bn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <!--  planing semestre -->
                  <td v-if="pta.t1Pret != undefined && pta.t1Pret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t1Pret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t1Pret != '' || pta.t1Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ (pta.t1Pret + pta.t1Bn) | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t2Bn != undefined && pta.t2Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t2Bn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t2Pret != undefined && pta.t2Pret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t2Pret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t2Pret != '' || pta.t2Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ (pta.t2Pret + pta.t2Bn) | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t3Bn != undefined && pta.t3Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t3Bn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t3Pret != undefined && pta.t3Pret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t3Pret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t3Pret != '' || pta.t3Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ (pta.t3Pret + pta.t3Bn) | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t4Bn != undefined && pta.t4Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t4Bn | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                  </td>

                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t4Pret != undefined && pta.t4Pret != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span class="font-bold"> {{ pta.t4Pret | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>

                  <td v-if="pta.t4Pret != '' || pta.t4Bn != ''" class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                    <span v-if="pta.t4Pret != undefined && pta.t4Bn != undefined" class="font-bold"> {{ (pta.t4Pret + pta.t4Bn) | formatNumber }} </span>
                    <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                  </td>
                  <td class="p-2 whitespace-nowrap border relative dark:bg-gray-800 dark:border-gray-700" v-else></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
</template>

<script>
import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      tabPtab: [],
      annee: null,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },

  methods: {
    getPta() {
      console.log(this.$router);
      let data = {};
      data = {
        organisationId: this.$route.params.ongId,
      };
    //   
    //   if (this.annee == null) {
    //     const year = new Date().getFullYear();
    //   } else {
    //     data = {
    //       programmeId: this.currentUser.programme.id,
    //       annee: Number(this.annee),
    //     };
    //   }
      PtabService.getOrganisationPta(data)
        .then((data) => {
          console.log(data);
          this.tabPtab = data.data.data[0];
        })
        .catch((error) => {
          console.log(error);
        });
         
    }
  },
  mounted() {
    this.getPta();
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
