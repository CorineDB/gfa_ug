<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-3xl mt-5">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">Cette operation est irreverssible ? <br />Cliquer sur annuler pour annuler l'operation</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">Annuler</button>
          <button type="button" @click="deleteUser" class="btn btn-danger w-24">Supprimer</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter un utilisateur</h2>
      </ModalHeader>
      <form @submit.prevent="storeUser">
        <ModalBody class="p-10">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Nom</label>
              <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="Nom" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
            </div>
            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Prenoms</label>
              <input id="regular-form-1" type="text" required v-model="formData.prenom" class="form-control" placeholder="Prenoms" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Email</label>
              <input id="regular-form-1" type="email" required v-model="formData.email" class="form-control" placeholder="Email" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Contact</label>
              <input id="regular-form-1" type="text" required v-model="formData.contact" class="form-control" placeholder="Contact" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>

              <!-- Message de validation avec animation -->
              <div class="mt-2 min-h-[1.5rem]">
                <p v-if="isContactValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Numéro valide
                </p>
                <p v-else-if="formData.contact && formData.contact.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Numéro invalide
                </p>
              </div>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Poste</label>
              <input id="regular-form-1" type="text" required v-model="formData.poste" class="form-control" placeholder="Poste" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
            </div>

            <div class="col-span-6">
              <div class="">
                <label class="form-label">Roles</label>
                <div class="flex w-full">
                  <TomSelect v-model="formData.roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-11/12 pr-3">
                    <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.nom }}</option>
                  </TomSelect>
                  <button @click="openCreateModal" class="btn w-10 h-10 btn-primary mr-1 mb-2">
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>

                <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.roles">{{ messageErreur.roles }}</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
            <VButton :loading="chargement" label="Ajouter" />
          </div>
        </ModalFooter>
      </form>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-between">
      <div class="search hidden sm:block">
        <input type="text" class="search__input form-control border-transparent" v-model="searchs" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <div class="flex items-center space-x-2">
        <button @click="addUsers" class="btn btn-primary flex space-x-2 items-center">
          <PlusSquareIcon />
          <span class="uppercase font-semibold"> ajouter</span>
        </button>
        <DownloadPDFButton :tableIds="['userOIN']" pageName="Utilisateurs" format="a4" />
      </div>
    </div>
    <!-- END: Modal Toggle -->

    <!-- État vide -->
    <div v-if="resultQuery.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-5">
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouvel utilisateur.</p>
        <div class="mt-6">
          <button @click="addUsers" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <PlusSquareIcon class="h-5 w-5 mr-2" />
            Ajouter un utilisateur
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des utilisateurs -->
    <div v-else class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-5">
      <!-- Header du tableau avec statistiques -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Liste des utilisateurs</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ resultQuery.length }} utilisateur{{ resultQuery.length > 1 ? 's' : '' }}
              {{ resultQuery.length > 1 ? 'trouvés' : 'trouvé' }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg class="w-2 h-2 mr-1 fill-current" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              {{ resultQuery.filter(u => u.roles && u.roles.length > 0).length }} actifs
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table id="userOIN" class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-b-2 border-gray-300">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">#</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Identité</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  <span>Poste</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Rôles</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6v6m8-6v6" />
                  </svg>
                  <span>Créé le</span>
                </div>
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(data, index) in resultQuery" :key="index" class="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-l-4 border-transparent hover:border-l-primary">
              <!-- Numéro avec style badge -->
              <td class="px-6 py-5 whitespace-nowrap border-r border-gray-200">
                <div class="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-primary group-hover:text-white rounded-full text-sm font-bold text-gray-600 transition-colors duration-200">
                  {{ index + 1 }}
                </div>
              </td>

              <!-- Identité complète -->
              <td class="px-6 py-5 whitespace-nowrap border-r border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {{ (data.nom ? data.nom[0] : '') + (data.prenom ? data.prenom[0] : '') }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900">{{ data.nom }}</div>
                    <div class="text-sm text-gray-600">{{ data.prenom }}</div>
                  </div>
                </div>
              </td>

              <!-- Contact avec icônes -->
              <td class="px-6 py-5 border-r border-gray-200">
                <div class="space-y-2">
                  <div class="flex items-center text-sm text-gray-900">
                    <div class="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mr-3">
                      <svg class="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="truncate max-w-40">{{ data.email }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <div class="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-3">
                      <svg class="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    {{ data.contact }}
                  </div>
                </div>
              </td>

              <!-- Poste avec style amélioré -->
              <td class="px-6 py-5 whitespace-nowrap border-r border-gray-200">
                <div v-if="data.poste" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  {{ data.poste }}
                </div>
                <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 italic">
                  Non défini
                </span>
              </td>

              <!-- Rôles -->
              <td class="px-6 py-5 border-r border-gray-200">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(role, roleIndex) in data.roles" :key="roleIndex" class="inline-flex items-center px-2.5 py-0.5 text-primary">
                    {{ role.nom }}
                  </span>
                </div>
              </td>

              <!-- Date avec format amélioré -->
              <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                <div class="flex items-center">
                  <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6v6m8-6v6" />
                  </svg>
                  {{ data.created_at }}
                </div>
              </td>

              <!-- Actions avec design premium -->
              <td class="px-6 py-5 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <Tippy tag="button" class="group relative p-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md" content="Modifier l'utilisateur">
                    <EditIcon class="h-5 w-5" @click="openUpdateModal(data)" />
                  </Tippy>
                  <Tippy tag="button" class="group relative p-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md" content="Supprimer l'utilisateur">
                    <Trash2Icon class="h-5 w-5" @click="supprimer(index, data)" />
                  </Tippy>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination moderne -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6" v-if="totalPages() > 1">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Précédent
            </button>
            <button
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages()"
              @click="currentPage++"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                à
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, resultQuery.length) }}</span>
                sur
                <span class="font-medium">{{ resultQuery.length }}</span>
                résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>

                <template v-if="totalPages() <= 7">
                  <button
                    v-for="pageNumber in totalPages()"
                    :key="pageNumber"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-150"
                    :class="pageNumber === currentPage
                      ? 'z-10 bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    @click="goToPage(pageNumber)"
                  >
                    {{ pageNumber }}
                  </button>
                </template>

                <template v-else>
                  <!-- Logic simplifiée pour les grandes paginations -->
                  <button
                    v-for="pageNumber in getVisiblePages()"
                    :key="pageNumber"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-150"
                    :class="pageNumber === currentPage
                      ? 'z-10 bg-primary border-primary text-white'
                      : pageNumber === '...'
                      ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    @click="pageNumber !== '...' && goToPage(pageNumber)"
                  >
                    {{ pageNumber }}
                  </button>
                </template>

                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === totalPages()"
                  @click="currentPage++"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter un Rôle</h2>
    </ModalHeader>
    <form @submit.prevent="createData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

          <div class="my-2">
            <label for="regular-form-2" class="form-label">Description</label>
            <textarea id="regular-form-2" placeholder="Description du role" required v-model="payload.description" class="w-full px-3 py-2 mt-1 border-2 border-gray-300 form-control focus:outline-none focus:ring-2 focus:border-transparent" rows="2"></textarea>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.description">{{ messageErreur.description }}</p>
          </div>

          <div class="w-full">
            <div class="flex w-full">
              <v-select :reduce="(projet) => projet.id" class="w-full" v-model="payload.permissions" multiple label="nom" :options="permissions">
                <template #search="{ attributes, events }">
                  <input class="vs__search form-input" :required="!payload.permissions" v-bind="attributes" v-on="events" />
                </template>
              </v-select>
              <label class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Permissions <span class="text-danger">*</span> </label>
            </div>
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.permissions">{{ messageErreur.permissions }}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetRoleForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <Modal backdrop="static" size="modal-xl" :show="updateModal" @hidden="updateModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un utilisateur</h2>
    </ModalHeader>
    <form @submit.prevent="submitUpdateData">
      <ModalBody>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formEdit.nom" class="form-control" placeholder="Nom" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Prenoms</label>
            <input id="regular-form-1" type="text" required v-model="formEdit.prenom" class="form-control" placeholder="Prenoms" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Email</label>
            <input id="regular-form-1" type="email" required v-model="formEdit.email" class="form-control" placeholder="Email" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Contact</label>
            <input id="regular-form-1" type="text" v-model="formEdit.contact" class="form-control" placeholder="Contact" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>

            <!-- Message de validation avec animation -->
            <div class="mt-2 min-h-[1.5rem]">
              <p v-if="isContactEditValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Numéro valide
              </p>
              <p v-else-if="formEdit.contact && formEdit.contact.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Numéro invalide
              </p>
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Poste</label>
            <input id="regular-form-1" type="text" v-model="formEdit.poste" class="form-control" placeholder="Poste" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
          </div>

          <div class="">
            <label class="form-label">Roles</label>
            <TomSelect v-model="formEdit.roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-full">
              <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.roles">{{ messageErreur.roles }}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed, getCurrentInstance } from "vue";
import UsersService from "../../services/modules/user.service";
import RoleService from "@/services/modules/roles.permissions.service";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DownloadPDFButton from "@/components/DownloadPDFButton.vue";

// Modfier un utilisateur
const updateModal = ref(false);

// Configuration pour la validation de numéro
const { proxy } = getCurrentInstance();

// Computed properties pour validation des numéros
const isContactValid = computed(() => {
  return proxy.$isValidPhoneNumber(formData.contact, "BJ");
});

const isContactEditValid = computed(() => {
  return proxy.$isValidPhoneNumber(formEdit.contact, "BJ");
});

const formEdit = reactive({
  nom: "",
  prenom: "",
  email: "",
  contact: "",
  poste: "",
  roles: [],
});

const showModalCreate = ref(false);
const payload = reactive({
  nom: "",
  description: "",
  permissions: [],
});

const resetRoleForm = () => {
  payload.nom = "";
  payload.description = "";
  payload.permissions = [];

  showModalCreate.value = false;
};

const permissions = ref([]);

const getInfoUsers = async () => {
  await RoleService.getInfo()
    .then((result) => {
      permissions.value = result.data.data.role[0].permissions;
    })
    .catch((e) => {

      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const createData = async () => {
  isLoading.value = true;
  await RoleService.create(payload)
    .then(() => {
      isLoading.value = false;
      getRole();
      resetRoleForm();
      toast.success("Rôles et permissions créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      toast.error("Vérifier les informations et ressayer.");
      if (e.response && e.response.data && e.response.data.errors) {
        messageErreur.value = e.response.data.errors;
      } else {
        toast.error("Une erreur inconnue s'est produite");
      }
    });
};

const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = true;
  messageErreur.value = {};
};

const userId = ref([]);

const messageErreur = ref({});

const openUpdateModal = function (data) {
  messageErreur.value = {};
  updateModal.value = true;
  formEdit.nom = data.nom;
  formEdit.prenom = data.prenom;
  formEdit.contact = data.contact;
  formEdit.email = data.email;
  formEdit.poste = data.poste;
  userId.value = data.id;
  formEdit.roles = data.roles.map((role) => role.id);
};

const resetForm = () => {
  formEdit.nom = "";
  formEdit.prenom = "";
  formEdit.contact = "";
  formEdit.email = "";
  formEdit.poste = "";
  formEdit.roles = [];

  updateModal.value = false;
  showModal.value = false;
};

const isLoading = ref(false);

const submitUpdateData = function () {
  // Validation du numéro de téléphone
  if (!isContactEditValid.value && formEdit.contact && formEdit.contact.length > 0) {
    toast.error("Le numéro de contact n'est pas valide");
    return;
  }

  isLoading.value = true;
  UsersService.update(userId.value, formEdit)
    .then((data) => {
      toast.success("Utilisateur modifié avec succès");
      resetForm();
      getData();
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      toast.error("Une erreur est survenue");

      if (error.response && error.response.data && error.response.data.errors) {
        messageErreur.value = error.response.data.errors;
      } else {
        toast.error("Une erreur inconnue s'est produite");
      }
    });
};

const showModal = ref(false);
const deleteModalPreview = ref(false);
const successNotification = ref();
const searchs = ref("");
const users = ref([]);
const roles = ref([]);
const deleteData = reactive({});
const saveUpdate = reactive({});
const chargement = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isUpdate = ref(false);
/* const formData = reactive({
  nom:'',
  prenom:'',
  password:'demo1234',
  email:'',
  entrepriseNom:'',
  entrepriseContact:''
}) */

const formData = reactive({
  nom: "",
  prenom: "",
  password: "demo1234",
  email: "@gmail.com",
  contact: "",
  poste: "",
  roles: [],
});

const message = reactive({
  type: "success",
  message: "",
});

const resultQuery = computed(() => {
  if (searchs.value) {
    return users.value.filter((item) => {
      return (
        (item.nom && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.nom.toLowerCase().includes(v))) ||
        (item.prenom && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.prenom.toLowerCase().includes(v))) ||
        (item.email && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.email.toLowerCase().includes(v))) ||
        (item.poste && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.poste.toLowerCase().includes(v))) ||
        (item.contact && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.contact.toLowerCase().includes(v))) ||
        (item.roles && item.roles.length > 0 &&
         item.roles.some(role => role && role.nom &&
           searchs.value
             .toLowerCase()
             .split(" ")
             .every((v) => role.nom.toLowerCase().includes(v)))) ||
        (item.created_at && searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.created_at.toLowerCase().includes(v)))
      );
    });
  } else {
    // return users.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return users.value.slice(startIndex, endIndex);
  }
});

onMounted(function () {
  if (!$h.getPermission("read.utilisateur")) {
    //router.push('/error-page')
  }
  getData();
  getRole();
  getInfoUsers();
});

const getRole = function () {
  RoleService.getRole()
    .then((data) => {
      roles.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

const getData = function () {
  UsersService.get()
    .then((data) => {
      users.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

function totalPages() {
  return Math.ceil(users.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
};
function close() {
  formData.nom = "";
  (formData.prenom = ""), (formData.contact = ""), (formData.poste = ""), (formData.email = "@gmail.com"), (formData.roles = []);
  showModal.value = false;
}

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};

const addUsers = function () {
  messageErreur.value = {};
  showModal.value = true;
  isUpdate.value = false;
};

const storeUser = function () {
  if (!chargement.value) {
    // Validation du numéro de téléphone
    if (!isContactValid.value && formData.contact && formData.contact.length > 0) {
      toast.error("Le numéro de contact n'est pas valide");
      return;
    }

    chargement.value = true;
    UsersService.addUsers(formData)
      .then((data) => {
        toast.success("Utilisateur ajouté avec succès");
        close();
        getData();
        chargement.value = false;
      })
      .catch((error) => {
        chargement.value = false;
        toast.error("Vérifier les informations et ressayer.");
        if (error.response && error.response.data && error.response.data.errors) {
          messageErreur.value = error.response.data.errors;
        } else {
          toast.error("Une erreur inconnue s'est produite");
        }
      });
  }
};

const supprimer = function (index, data) {
  deleteModalPreview.value = true;
  deleteData.id = data.id;
  deleteData.nom = data.nom;
  deleteData.prenom = data.prenom;
  deleteData.poste = data.poste;
  deleteData.email = data.email;
  deleteData.contact = data.contact;
  deleteData.index = index;
};

const deleteUser = function () {
  deleteModalPreview.value = false;
  users.value.splice(users.value.indexOf(deleteData.index), 1);
  UsersService.destroy(deleteData.id)
    .then((data) => {
      message.type = "success";
      message.message = "Operation éffectué avec success";
      successNotificationToggle();
      getData();
    })
    .catch((error) => {
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message;
        message.type = "erreur";
        message.message = erreurs;
        successNotificationToggle();
      } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
      } else {
        // Une erreur s'est produite lors de la configuration de la demande
      }
    });
};
</script>

<style lang="scss" scoped></style>