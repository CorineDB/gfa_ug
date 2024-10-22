<template>
  <div class="container p-4 mx-auto">
    <div v-for="gouvernance in datas" :key="gouvernance.id" class="mb-8">
      <!-- Titre Gouvernance -->
      <h2 class="mb-4 text-2xl font-bold">{{ gouvernance.nom }}</h2>

      <!-- Table Gouvernance -->
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="px-4 py-2 border">Principes</th>
            <th class="px-4 py-2 border">Critères</th>
            <th class="px-4 py-2 border">Indicateurs</th>
            <th class="px-4 py-2 border">Réponses</th>
            <th class="px-4 py-2 border">Note</th>
            <th class="px-4 py-2 border">Source de validation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(principe, pIndex) in gouvernance.principes_de_gouvernance" :key="principe.id">
            <!-- Fusionner les cellules des principes -->
            <td class="px-4 py-2 border" :rowspan="calculateRowSpan(principe.criteres_de_gouvernance)">
              {{ principe.nom }}
            </td>

            <template v-for="(critere, cIndex) in principe.criteres_de_gouvernance" :key="critere.id">
              <td v-if="cIndex === 0" :rowspan="critere.indicateurs_de_gouvernance.length" class="px-4 py-2 border">
                {{ critere.nom }}
              </td>

              <template v-for="(indicateur, iIndex) in critere.indicateurs_de_gouvernance" :key="indicateur.id">
                <tr v-if="iIndex > 0">
                  <!-- Critère -->
                  <td class="px-4 py-2 border">{{ critere.nom }}</td>
                </tr>
                <td class="px-4 py-2 border">{{ indicateur.nom }}</td>
                <td class="px-4 py-2 border">{{ indicateur.can_have_multiple_reponse ? "Oui" : "Non" }}</td>
                <td class="px-4 py-2 border">{{ indicateur.note }}</td>
                <td class="px-4 py-2 border">Nom de la source</td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datas: [
        {
          id: "KJX3Od8nrE8lA0MQGK5jRvLwD43Yq6BbMy12gz7NkZXOVJnameobpWd9Rm6L419Y",
          nom: "Gouvernance 2",
          principes_de_gouvernance: [
            {
              id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
              nom: "Principes 1",
              criteres_de_gouvernance: [
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 1",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                // Critères suivants...
              ],
            },
            // Principes suivants...
          ],
        },
        // Gouvernances suivantes...
      ],
    };
  },
  methods: {
    calculateRowSpan(criteres) {
      return criteres.reduce((acc, critere) => acc + critere.indicateurs_de_gouvernance.length, 0);
    },
  },
};
</script>
