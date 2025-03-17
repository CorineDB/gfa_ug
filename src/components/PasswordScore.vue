<template>
  <div class="relative select-none">
    <!-- <pre>{{ descriptions.length }}</pre> -->
    <BaseProgressBar :value="score" :max="descriptions.length" :color="description.color" />
    <p class="_absolute mt-1 text-sm text-left">
      {{ description.label }}
    </p>
  </div>
</template>

<script>
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import BaseProgressBar from "./BaseProgressBar.vue";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { computed } from "vue";

export default {
  components: {
    BaseProgressBar,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    // Configuration des options
    const options = {
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    };

    zxcvbnOptions.setOptions(options);

    // Calcul du score
    const score = computed(() => {
      if (!props.value || props.value.length === 0) {
        return 0;
      }
      return zxcvbn(props.value).score + 1;
    });

    const descriptions = computed(() => [
      {
        color: "bg-red-600",
        label: "Faible",
      },
      { color: "bg-red-300", label: "Toujours faible" },
      { color: "bg-yellow-400", label: "Moyen" },
      { color: "bg-green-200", label: "Bien" },
      {
        color: "bg-green-400",
        label: "Fort",
      },
    ]);

    const description = computed(() =>
      props.value && props.value.length > 0
        ? descriptions.value[score.value - 1]
        : {
            color: "bg-transparent",
            label: "Commencez à taper pour vérifier votre mot de passe",
          }
    );

    // Retourne le score pour l'utiliser dans le template
    return { description, score, descriptions };
  },
};
</script>
