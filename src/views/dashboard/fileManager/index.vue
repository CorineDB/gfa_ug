<template>
  <div class="w-full">
    <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Uploader des fichiers</h2>
      </ModalHeader>
      <form action="" @submit.prevent="save">
        <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="m-4 col-span-12">
            <InputForm type="file" @change="previewFiles" label="Fichiers" :required="false" id="file_input" />
            <!-- <input class="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 placeholder:text-xs md:placeholder:text-sm" aria-describedby="file_input_help" id="file_input" /> -->
          </div>

          <div class="m-4 col-span-12">
            <label class="form-label">Partager à</label>
            <TomSelect multiple v-model="value" :options="{ placeholder: 'Ajouter une nouvelle personne' }" class="w-full">
              <option v-for="(form, index) in users" :key="index" :value="form.id">{{ form.nom }}</option>
            </TomSelect>
            <!-- <multiselect :hideSelected="true" :closeOnSelect="false" v-model="value" tag-placeholder="Ajouter une nouvelle personne" placeholder="Ajouter une nouvelle personne" label="nom" track-by="nom" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" :options="users" :multiple="true" :taggable="true" @tag="addTag"></multiselect> -->
          </div>

          <!-- <div class="flex items-center justify-center gap-4 pt-5 pb-5 my-4 md:gap-8">
            <button type="submit" class="w-auto px-4 py-2 font-medium text-white shadow-xl bg-blue-500 hover:opacity-80">
              <span class="mx-2 text-sm font-semibold uppercase" v-if="chargement == false"> Enregistrer et fermer </span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button @click="showModal = false" class="w-auto px-4 py-2 font-medium text-white shadow-xl bg-primary hover:opacity-80">fermer</button>
          </div> -->
        </ModalBody>
        <ModalFooter>
          <div class="flex items-center justify-center">
            <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
            <VButton class="inline-block" label="Enregistrer et fermer" :loading="chargement" :type="submit" />
          </div>
        </ModalFooter>
      </form>
    </Modal>

    <div class="bg-white relative p-4 border hover:border-gray-300 shadow-inner my-6">
      <div class="flex justify-between items-center space-x-3 border-gray-300 border p-2">
        <div class="flex">
          <button v-if="fichierAdd" @click="uploadFile" title="uploader un fichier" class="p-2 overflow-hidden flex space-x-2 items-center text-xs font-semibold text-white uppercase rounded bg-primary focus:outline-none focus:shadow-outline">
            <span
              ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 13v4h-2v-4H8l4-5 4 5h-3z"></path>
                </g></svg
            ></span>
            <span class="mx-2 text-xs md:text-sm font-semibold">uploader un fichier</span>
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <div>
            <search-bar @search="getSearchValue"></search-bar>
          </div>
        </div>
      </div>

      <div class="p-2" v-if="!isSearch">
        <div v-if="main" class="flex space-x-4">
          <div @click="gotoDocument" class="flex flex-col cursor-pointer">
            <span class="text-yellow-400">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"></path></svg>
            </span>
            <span class="text-sm text-center font-semibold">Mes documents</span>
          </div>
          <div @click="gotoShare" class="flex flex-col cursor-pointer">
            <span class="text-yellow-400">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3zM2.19 3c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293L7.586 3H2.19zm9.608 5.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742z"></path></svg>
            </span>
            <span class="text-sm text-center font-semibold">Documents partagées</span>
          </div>
        </div>

        <div v-if="seeDocument" class="content-main">
          <nav v-if="!main && preserveMain" class="text-sm font-semibold" aria-label="Breadcrumb">
            <div>
              <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                <li class="flex space-x-2 mx-2 items-center">
                  <span title="en arriere" @click="backMain" class="cursor-pointer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                  </span>
                </li>
                <li class=" ">
                  <span class="px-1 font-bold text-base"> /</span>
                  <router-link to="#" class="text-gray-600 text-base">mes documents</router-link>
                </li>
              </ol>
            </div>
          </nav>

          <div v-if="main2" class="flex space-x-4">
            <div @click="gotoProjet" class="flex flex-col cursor-pointer">
              <span class="text-yellow-400">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"></path></svg>
              </span>
              <span class="text-sm text-center font-semibold">Projets</span>
            </div>
            <div @click="gotoAutre" class="flex flex-col cursor-pointer">
              <span class="text-yellow-400">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"></path></svg>
              </span>
              <span class="text-sm text-center font-semibold">autres</span>
            </div>
          </div>

          <div v-if="seeProjetFolder">
            <nav v-if="!main2" class="text-sm font-semibold" aria-label="Breadcrumb">
              <div>
                <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                  <li class="flex space-x-2 mx-2 items-center">
                    <span title="en arriere" @click="backMain1" class="cursor-pointer">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                    </span>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">mes documents</router-link>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">projet</router-link>
                  </li>
                </ol>
              </div>
            </nav>
            <div v-if="!main2" class="content">
              <div class="grid grid-cols-6 gap-5 justify-center mt-4 items-center">
                <div class="flex flex-col cursor-pointer" v-for="(projet, index) in fichiersProjet" :key="index">
                  <span v-if="projet.extension == 'docx'" class="text-blue-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23.004 1.5q.41 0 .703.293t.293.703v19.008q0 .41-.293.703t-.703.293H6.996q-.41 0-.703-.293T6 21.504V18H.996q-.41 0-.703-.293T0 17.004V6.996q0-.41.293-.703T.996 6H6V2.496q0-.41.293-.703t.703-.293zM6.035 11.203l1.442 4.735h1.64l1.57-7.876H9.036l-.937 4.653-1.325-4.5H5.38l-1.406 4.523-.938-4.675H1.312l1.57 7.874h1.641zM23.0 21v-3h-15v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3h-15v3Z"></path>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'pdf'" class="text-red-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm3.025.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                      <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'png' || projet.extension == 'jpg' || projet.extension == 'jpeg'" class="">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13"></polygon>
                      <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5"></polygon>
                      <polygon fill="#1565C0" points="21,23 14,33 28,33"></polygon>
                      <polygon fill="#1976D2" points="28,26.4 23,33 33,33"></polygon>
                      <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5"></circle>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'xlsx' || projet.extension == 'xlsm' || projet.extension == 'xlsb' || projet.extension == 'xltx'" class="text-green-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"></path>
                    </svg>
                  </span>

                  <p @click="($event) => getFichier(projet.id, projet.nom)" target="_blank" :download="projet.nom" class="font-medium text-gray-700">{{ projet.nom.substring(0, 20) }} <span class="cursor-pointer font-black text-xl px-1 rounded-md" v-if="projet.nom.length > 20" :title="projet.nom">...</span></p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="seeOtherFolder">
            <nav v-if="!main2" class="text-sm font-semibold" aria-label="Breadcrumb">
              <div>
                <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                  <li class="flex space-x-2 mx-2 items-center">
                    <span title="en arriere" @click="backMain1" class="cursor-pointer">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                    </span>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">mes documents</router-link>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">autres</router-link>
                  </li>
                </ol>
              </div>
            </nav>
            <div v-if="!main2" class="content">
              <div class="grid grid-cols-6 gap-5 justify-center mt-4 items-center">
                <div class="flex flex-col cursor-pointer" v-for="(autre, index) in fichiersAutre" :key="index">
                  <span v-if="autre.extension == 'docx'" class="text-blue-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23.004 1.5q.41 0 .703.293t.293.703v19.008q0 .41-.293.703t-.703.293H6.996q-.41 0-.703-.293T6 21.504V18H.996q-.41 0-.703-.293T0 17.004V6.996q0-.41.293-.703T.996 6H6V2.496q0-.41.293-.703t.703-.293zM6.035 11.203l1.442 4.735h1.64l1.57-7.876H9.036l-.937 4.653-1.325-4.5H5.38l-1.406 4.523-.938-4.675H1.312l1.57 7.874h1.641zM23.0 21v-3h-15v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3h-15v3Z"></path>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'pdf'" class="text-red-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm3.025.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                      <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'png' || autre.extension == 'jpg' || autre.extension == 'jpeg'" class="">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13"></polygon>
                      <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5"></polygon>
                      <polygon fill="#1565C0" points="21,23 14,33 28,33"></polygon>
                      <polygon fill="#1976D2" points="28,26.4 23,33 33,33"></polygon>
                      <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5"></circle>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'xlsx' || autre.extension == 'xlsm' || autre.extension == 'xlsb' || autre.extension == 'xltx'" class="text-green-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"></path>
                    </svg>
                  </span>
                  <p @click="($event) => getFichier(autre.id, autre.nom)" target="_blank" :download="autre.nom" class="font-medium text-gray-700">{{ autre.nom.substring(0, 20) }} <span class="cursor-pointer font-black text-xl px-1 rounded-md" v-if="autre.nom.length > 20" :title="autre.nom">...</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="seeShare" class="content-main">
          <nav v-if="!main && preserveMain" class="text-sm font-semibold" aria-label="Breadcrumb">
            <div>
              <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                <li class="flex space-x-2 mx-2 items-center">
                  <span title="en arriere" @click="backMain" class="cursor-pointer">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                  </span>
                </li>
                <li class=" ">
                  <span class="px-1 font-bold text-base"> /</span>
                  <router-link to="#" class="text-gray-600 text-base">documents partager </router-link>
                </li>
              </ol>
            </div>
          </nav>

          <div v-if="main2" class="flex space-x-4">
            <div @click="gotoProjet" class="flex flex-col cursor-pointer">
              <span class="text-yellow-400">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"></path></svg>
              </span>
              <span class="text-sm text-center font-semibold">Projets</span>
            </div>
            <div @click="gotoAutre" class="flex flex-col cursor-pointer">
              <span class="text-yellow-400">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="5.0em" width="5.0em" xmlns="http://www.w3.org/2000/svg"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"></path></svg>
              </span>
              <span class="text-sm text-center font-semibold">autres</span>
            </div>
          </div>

          <div v-if="seeProjetFolder">
            <nav v-if="!main2" class="text-sm font-semibold" aria-label="Breadcrumb">
              <div>
                <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                  <li class="flex space-x-2 mx-2 items-center">
                    <span title="en arriere" @click="backMain1" class="cursor-pointer">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                    </span>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">documents partager</router-link>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">projet</router-link>
                  </li>
                </ol>
              </div>
            </nav>
            <div v-if="!main2" class="content">
              <div class="grid grid-cols-6 gap-5 justify-center mt-4 items-center">
                <div class="flex flex-col cursor-pointer" v-for="(projet, index) in sharedProjet" :key="index">
                  <span v-if="projet.extension == 'docx'" class="text-blue-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23.004 1.5q.41 0 .703.293t.293.703v19.008q0 .41-.293.703t-.703.293H6.996q-.41 0-.703-.293T6 21.504V18H.996q-.41 0-.703-.293T0 17.004V6.996q0-.41.293-.703T.996 6H6V2.496q0-.41.293-.703t.703-.293zM6.035 11.203l1.442 4.735h1.64l1.57-7.876H9.036l-.937 4.653-1.325-4.5H5.38l-1.406 4.523-.938-4.675H1.312l1.57 7.874h1.641zM23.0 21v-3h-15v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3h-15v3Z"></path>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'pdf'" class="text-red-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm3.025.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                      <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'png' || projet.extension == 'jpg' || projet.extension == 'jpeg'" class="">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13"></polygon>
                      <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5"></polygon>
                      <polygon fill="#1565C0" points="21,23 14,33 28,33"></polygon>
                      <polygon fill="#1976D2" points="28,26.4 23,33 33,33"></polygon>
                      <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5"></circle>
                    </svg>
                  </span>

                  <span v-if="projet.extension == 'xlsx' || projet.extension == 'xlsm' || projet.extension == 'xlsb' || projet.extension == 'xltx'" class="text-green-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"></path>
                    </svg>
                  </span>

                  <p @click="($event) => getFichier(projet.id, projet.nom)" target="_blank" :download="projet.nom" class="font-medium text-gray-700">{{ projet.nom.substring(0, 20) }} <span class="cursor-pointer font-black text-xl px-1 rounded-md" v-if="projet.nom.length > 20" :title="projet.nom">...</span></p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="seeOtherFolder">
            <nav v-if="!main2" class="text-sm font-semibold" aria-label="Breadcrumb">
              <div>
                <ol class="inline-flex items-center p-0 bg-white py-2 shadow w-full list-none">
                  <li class="flex space-x-2 mx-2 items-center">
                    <span title="en arriere" @click="backMain1" class="cursor-pointer">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path></svg>
                    </span>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">documents partager</router-link>
                  </li>
                  <li class=" ">
                    <span class="px-1 font-bold text-base"> /</span>
                    <router-link to="#" class="text-gray-600 text-base">autres</router-link>
                  </li>
                </ol>
              </div>
            </nav>
            <div v-if="!main2" class="content">
              <div class="grid grid-cols-6 gap-5 justify-center mt-4 items-center">
                <div class="flex flex-col cursor-pointer" v-for="(autre, index) in sharedAutre" :key="index">
                  <span v-if="autre.extension == 'docx'" class="text-blue-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23.004 1.5q.41 0 .703.293t.293.703v19.008q0 .41-.293.703t-.703.293H6.996q-.41 0-.703-.293T6 21.504V18H.996q-.41 0-.703-.293T0 17.004V6.996q0-.41.293-.703T.996 6H6V2.496q0-.41.293-.703t.703-.293zM6.035 11.203l1.442 4.735h1.64l1.57-7.876H9.036l-.937 4.653-1.325-4.5H5.38l-1.406 4.523-.938-4.675H1.312l1.57 7.874h1.641zM23.0 21v-3h-15v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3h-15v3Z"></path>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'pdf'" class="text-red-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm3.025.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                      <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'png' || autre.extension == 'jpg' || autre.extension == 'jpeg'" class="">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13"></polygon>
                      <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5"></polygon>
                      <polygon fill="#1565C0" points="21,23 14,33 28,33"></polygon>
                      <polygon fill="#1976D2" points="28,26.4 23,33 33,33"></polygon>
                      <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5"></circle>
                    </svg>
                  </span>

                  <span v-if="autre.extension == 'xlsx' || autre.extension == 'xlsm' || autre.extension == 'xlsb' || autre.extension == 'xltx'" class="text-green-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                      <title></title>
                      <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"></path>
                    </svg>
                  </span>
                  <p @click="($event) => getFichier(autre.id, autre.nom)" target="_blank" :download="autre.nom" class="font-medium text-gray-700">{{ autre.nom.substring(0, 20) }} <span class="cursor-pointer font-black text-xl px-1 rounded-md" v-if="autre.nom.length > 20" :title="autre.nom">...</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="py-2 text-xl text-bold">Resultat de la Recherche ...</h1>
        <div class="content">
          <div class="grid grid-cols-6 gap-5 justify-center mt-4 items-center">
            <div class="flex flex-col cursor-pointer" v-for="(data, index) in filtere" :key="index">
              <span v-if="data.extension == 'docx'" class="text-blue-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                  <title></title>
                  <path d="M23.004 1.5q.41 0 .703.293t.293.703v19.008q0 .41-.293.703t-.703.293H6.996q-.41 0-.703-.293T6 21.504V18H.996q-.41 0-.703-.293T0 17.004V6.996q0-.41.293-.703T.996 6H6V2.496q0-.41.293-.703t.703-.293zM6.035 11.203l1.442 4.735h1.64l1.57-7.876H9.036l-.937 4.653-1.325-4.5H5.38l-1.406 4.523-.938-4.675H1.312l1.57 7.874h1.641zM23.0 21v-3h-15v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3h-15v3Z"></path>
                </svg>
              </span>

              <span v-if="data.extension == 'pdf'" class="text-red-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm3.025.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                  <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
                </svg>
              </span>

              <span v-if="data.extension == 'png' || data.extension == 'jpg' || data.extension == 'jpeg'" class="">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                  <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13"></polygon>
                  <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5"></polygon>
                  <polygon fill="#1565C0" points="21,23 14,33 28,33"></polygon>
                  <polygon fill="#1976D2" points="28,26.4 23,33 33,33"></polygon>
                  <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5"></circle>
                </svg>
              </span>

              <span v-if="data.extension == 'xlsx' || data.extension == 'xlsm' || data.extension == 'xlsb' || data.extension == 'xltx'" class="text-green-500">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="3.0em" width="3.0em" xmlns="http://www.w3.org/2000/svg">
                  <title></title>
                  <path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"></path>
                </svg>
              </span>
              <p @click="($event) => getFichier(data.id, data.nom)" target="_blank" :download="data.nom" class="font-medium text-gray-700">{{ data.nom.substring(0, 20) }} <span class="cursor-pointer font-black text-xl px-1 rounded-md" v-if="data.nom.length > 20" :title="data.nom">...</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/services/configs/environment.js";
import InputForm from "@/components/news/InputForm.vue";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import UsersService from "@/services/modules/utilisateur.service.js";
import FichierService from "@/services/modules/fichier.service.js";
import VButton from "@/components/news/VButton.vue";

export default {
  layout: "dashboard",
  components: { InputForm, VButton },
  data() {
    return {
      base_url: API_BASE_URL,
      showModal: false,
      showModal2: false,
      showModal3: false,
      chargement: false,
      search: "",
      title: "",
      line: false,
      mosaique: true,
      filtreName: true,
      filtreType: true,
      filtreDate: true,
      filtreTaille: true,
      value: [],
      users: [],
      files: [
        {
          images: [
            { url: "/upload/img/voiture1.jpg", title: "voiture1" },
            { url: "/upload/img/voiture2.jpg", title: "voiture2" },
          ],
        },
        {
          pdf: [
            { url: "/upload/pdf/CononDoyle_LeSigneDesQuatre.pdf", title: "Le Signe Des Quatre" },
            { url: "/upload/pdf/Doyle-chien.pdf", title: "Doyle-chien.pdf" },
            { url: "/upload/pdf/CononDoyle_UneEtudeEnRouge.pdf", title: "Une Etude en Rouge.pdf" },
          ],
        },
        {
          excel: [
            { url: "/upload/excel/gomez.xlsx", title: "gomez" },
            { url: "/upload/excel/planning_1_semestre.xlxs", title: "planning" },
          ],
        },
        {
          word: [
            { url: "/upload/word/BILAN ACTUELLE DU PROJET IZICONTROL.docx", title: "BILAN ACTUELLE..." },
            { url: "/upload/word/BILAN DES ACTIVITES DU MOIS DE JANVIER 2022.docx", title: "BILAN DES ACTIVITES ..." },
            { url: "/upload/word/BILAN MOIS DE MAI.docx", title: "BILAN MOIS DE MAI..." },
            { url: "/upload/word/test.docx", title: "test" },
          ],
        },
      ],
      pdfFile: "",
      typeFile: "",
      imagefile: "",
      datasFiles: [],
      fichiers: [],
      shared: [],
      fichiersAno: [],
      sharedAno: [],
      fichiersReponse: [],
      sharedReponse: [],
      fichiersProjet: [],
      fichiersAutre: [],
      sharedProjet: [],
      sharedAutre: [],
      seeAnosFolder: false,
      seeReponseAnosFolder: false,
      seeProjetFolder: false,
      seeOtherFolder: false,
      seeDocument: false,
      seeShare: false,
      main: true,
      preserveMain: true,
      main2: false,
      programmeId: "",
      usersId: [],
      allFiles: [],
      fichierVisible: false,
      fichierAdd: false,
      isSearch: false,
    };
  },
  methods: {
    addTag(newTag) {
      const tag = {
        nom: newTag,
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    previewFiles(event) {
      const data = event.target.files[0];
      this.datasFiles = data;
    },
    save() {
      this.value.forEach((element) => {
        this.usersId.push(element);
      });

      const formData = new FormData();
      formData.append("fichier", this.datasFiles);
      for (let i = 0; i < this.usersId.length; i++) {
        let file = this.usersId[i];
        formData.append("sharedId[]", file);
      }

      formData.append("autre", "autre");
      if (this.chargement == false) {
        this.chargement = true;
        FichierService.create(formData)
          .then((data) => {
            this.chargement = false;
            toast.success("televersement reuissi");
            this.showModal = false;
            this.getFiles();
          })
          .catch((e) => {
            this.chargement = false;
            toast.error(e);
          });
      }
    },

    getFichier(id, nom) {
      FichierService.getById(id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          window.open(url);

          toast.success("Téléchargement réussi");
        })
        .catch((e) => {
          toast.error(e);
        });
    },

    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-fichier") {
          this.fichierVisible = true;
        }
        if (element.slug === "creer-un-fichier") {
          this.fichierAdd = true;
        }
      });
    },
    getSearchValue(data) {
      if (data != "") {
        this.isSearch = true;
        this.search = data;
      } else {
        this.isSearch = false;
        this.search = data;
      }
    },
    getFiles() {
      FichierService.get()
        .then((data) => {
          let datas = data.data.data;
          let datasF = datas.fichiers;
          let datasS = datas.shared;
          this.fichiers = datasF;
          this.fichiersAno = datasF.ano;
          this.fichiersReponse = datasF.reponseAno;
          this.fichiersProjet = datasF.projet;
          this.fichiersAutre = datasF.autre;
          this.shared = datasS;
          this.sharedAno = datasS.ano;
          this.sharedReponse = datasS.reponseAno;
          this.sharedProjet = datasS.projet;
          this.sharedAutre = datasS.autre;
          this.allFiles = [].concat(datasF.ano, datasF.reponseAno, datasF.projet, datasF.autre, datasS.ano, datasS.reponseAno, datasS.projet, datasS.autre);
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
    getUser() {
      UsersService.getByProgramme(this.programmeId)
        .then((data) => {
          let datas = data.data.data;
          this.users = datas;
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
    uploadFile() {
      this.showModal = true;
    },
    trieTaille() {
      this.filtreTaille = !this.filtreTaille;
    },
    trieDate() {
      this.filtreDate = !this.filtreDate;
    },
    trieType() {
      this.filtreType = !this.filtreType;
    },
    trieName() {
      this.filtreName = !this.filtreName;
    },
    switch1() {
      this.mosaique = true;
      this.line = false;
    },
    switch2() {
      this.mosaique = false;
      this.line = true;
    },
    close() {
      this.showModal2 = false;

      this.pdfFile = "";
    },
    closeImg() {
      this.showModal3 = false;
      this.imageFile = "";
    },
    previewImage() {
      this.showModal3 = true;
      this.imageFile = file;
    },
    preview(file, type) {
      this.pdfFile = file;
      this.showModal2 = true;
    },
    gotoAnoFolder() {
      this.seeAnosFolder = true;
      this.seeReponseAnosFolder = false;
      this.seeProjetFolder = false;
      this.seeOtherFolder = false;
      this.main2 = false;
      this.main = false;
      this.preserveMain = false;
    },
    gotoResponse() {
      this.seeAnosFolder = false;
      this.seeReponseAnosFolder = true;
      this.seeProjetFolder = false;
      this.seeOtherFolder = false;
      this.main2 = false;
      this.main = false;
      this.preserveMain = false;
    },
    gotoProjet() {
      this.seeAnosFolder = false;
      this.seeReponseAnosFolder = false;
      this.seeProjetFolder = true;
      this.seeOtherFolder = false;
      this.main2 = false;
      this.main = false;
      this.preserveMain = false;
    },
    gotoAutre() {
      this.seeAnosFolder = false;
      this.seeReponseAnosFolder = false;
      this.seeProjetFolder = false;
      this.seeOtherFolder = true;
      this.main2 = false;
      this.main = false;
      this.preserveMain = false;
    },
    gotoDocument() {
      this.seeDocument = true;
      this.seeShare = false;
      this.main2 = true;
      this.main = false;
    },
    gotoShare() {
      this.seeDocument = false;
      this.seeShare = true;
      this.main = false;
      this.main2 = true;
    },
    backMain() {
      this.main = true;
      this.seeDocument = false;
      this.seeShare = false;
    },
    backMain1() {
      this.main2 = true;
      this.preserveMain = true;
    },
  },
  computed: {
    //importation des variables du module auths
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    filtere: function () {
      var self = this;
      return this.allFiles.filter(function (data) {
        return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
      });
    },
  },
  mounted() {
    this.getPermission();
    if (!this.fichierVisible) {
      this.$router.push("/401-non-autorise");
    }
    this.programmeId = this.currentUser.programme.id;
    this.getUser();
    this.getFiles();
  },
};
</script>

<style></style>
