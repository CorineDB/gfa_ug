<template>
  <div>
    <SurveyComponent :model="survey" />
  </div>
</template>

<script setup>
import "survey-core/defaultV2.min.css";
import { SurveyComponent } from "survey-vue3-ui";
import { Model } from "survey-core";
import { useRoute } from "vue-router";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import { ref } from "vue";

const route = useRoute();
const idForm = route.params.id;
const surveyJson = {
  logoPosition: "right",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "text",
          name: "question1",
        },
        {
          type: "text",
          name: "question3",
        },
        {
          type: "text",
          name: "question2",
          title: "rtzerzzere",
        },
        {
          type: "text",
          name: "question4",
          inputType: "date",
        },
        {
          type: "text",
          name: "question5",
        },
      ],
    },
  ],
};
const isLoadingData = ref(true);
const form_survey = ref();

const alertResults = (sender) => {
  const results = JSON.stringify(sender.data);
  alert(results);
};

const survey = new Model(surveyJson);
survey.onComplete.add(alertResults);

const getDatas = async () => {
  initTabulator();
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.getOne(idForm);
    form_survey.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération du formulaire.");
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(() => {
  // getDatas();
});
</script>

<style scoped></style>
