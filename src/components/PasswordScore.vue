<template>
    <div class="relative select-none">
      <p class="absolute mt-1 text-sm">
        {{ description.label }}
      </p>
    </div>
</template>

<script>
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { computed } from "vue";

export default {
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
        label: "Weak, my 2 years old son can break it!",
      },
      { color: "bg-red-300", label: "Still weak, keep on trying!" },
      { color: "bg-yellow-400", label: "We are getting there..." },
      { color: "bg-green-200", label: "Nice, but you can still do better" },
      {
        color: "bg-green-400",
        label: "Congratulations, you made it!",
      },
    ]);

    const description = computed(() =>
      props.value && props.value.length > 0
        ? descriptions.value[score.value - 1]
        : {
            color: "bg-transparent",
            label: "Start typing to check your password",
          }
    );

    // Retourne le score pour l'utiliser dans le template
    return { description };
  },
}
</script>