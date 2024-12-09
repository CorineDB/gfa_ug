<template>
  <Alert v-if="showAlert" class="flex items-center mb-2 !py-2 alert-danger" v-slot="{ dismiss }">
    <ul class="font-medium !list-disc">
      <li v-for="(error, index) in errorsNom" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsEmail" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsPhone" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsSigle" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsNomPF" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsPrenomPF" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsContactPF" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsContact" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsAddresse" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsLongitude" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsLatitude" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsArrondissement" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsDepartement" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsCommune" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsQuatier" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsCode" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsPays" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsType" :key="index">{{ error }}</li>
      <li v-for="(error, index) in errorsSecteurActivite" :key="index">{{ error }}</li>
    </ul>
    <button type="button" class="text-white btn-close" aria-label="Close" @click="dismiss">
      <XIcon class="w-4 h-4" />
    </button>
  </Alert>
</template>

<script setup>
import { computed } from "vue";

const prop = defineProps({
  errors: Object,
});

const showAlert = computed(() => {
  return Object.keys(prop.errors).length > 0;
});

const errorsNom = computed(() => {
  if (prop.errors.nom) return prop.errors.nom;
  return [];
});

const errorsEmail = computed(() => {
  if (prop.errors.email) return prop.errors.email;
  return [];
});

const errorsContact = computed(() => {
  if (prop.errors.contact) return prop.errors.contact;
  return [];
});

const errorsNomPF = computed(() => {
  if (prop.errors.nom_point_focal) return prop.errors.nom_point_focal;
  return [];
});

const errorsPrenomPF = computed(() => {
  if (prop.errors.prenom_point_focal) return prop.errors.prenom_point_focal;
  return [];
});

const errorsContactPF = computed(() => {
  if (prop.errors.contact_point_focal) return prop.errors.contact_point_focal;
  return [];
});

const errorsSigle = computed(() => {
  if (prop.errors.sigle) return prop.errors.sigle;
  return [];
});

const errorsLongitude = computed(() => {
  if (prop.errors.longitude) return prop.errors.longitude;
  return [];
});

const errorsLatitude = computed(() => {
  if (prop.errors.latitude) return prop.errors.latitude;
  return [];
});

const errorsAddresse = computed(() => {
  if (prop.errors.addresse) return prop.errors.addresse;
  return [];
});

const errorsCode = computed(() => {
  if (prop.errors.code) return prop.errors.code;
  return [];
});

const errorsQuatier = computed(() => {
  if (prop.errors.quatier) return prop.errors.quatier;
  return [];
});

const errorsCommune = computed(() => {
  if (prop.errors.commune) return prop.errors.commune;
  return [];
});

const errorsDepartement = computed(() => {
  if (prop.errors.departement) return prop.errors.departement;
  return [];
});

const errorsArrondissement = computed(() => {
  if (prop.errors.arrondissement) return prop.errors.arrondissement;
  return [];
});

const errorsPays = computed(() => {
  if (prop.errors.pays) return prop.errors.pays;
  return [];
});

const errorsSecteurActivite = computed(() => {
  if (prop.errors.secteurActivite) return prop.errors.secteurActivite;
  return [];
});

const errorsType = computed(() => {
  if (prop.errors.type) return prop.errors.type;
  return [];
});
</script>

<style scoped></style>
