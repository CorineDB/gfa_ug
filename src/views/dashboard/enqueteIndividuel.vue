<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Enquête Individuelle</h2>
    <LoaderSnipper v-if="loading" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <!-- <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
        <div class="flex">
          <button class="mr-2 shadow-md btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une enquête</button>
        </div>
      </div> -->
      <div v-show="!loading" class="iframe-container">
        <iframe :src="iframeSrc" @load="onIframeLoad"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const iframeSrc = "https://surveyjs.io/create-free-survey";
const loading = ref(true);

function onIframeLoad() {
  loading.value = false;
}
</script>

<style scoped>
.iframe-container {
  position: relative !important;
  width: 85vw !important;
  height: 85vh !important;
  padding-top: 56.25% !important; /* Rapport d'aspect 16:9 */
}
iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}
</style>
