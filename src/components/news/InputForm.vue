<script setup>
import { error } from "jquery";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "text",
  },
  control: {
    type: String,
    required: false,
  },
  optionel: {
    type: Boolean,
    default: true,
    required: false,
  },
  min: {
    type: String,
    required: false,
  },
  max: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Générer un id valide à partir du label
const inputId = computed(() => {
  return props.label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9]+/g, "_") // Remplace les caractères spéciaux par _
    .replace(/^_+|_+$/g, ""); // Supprime les _ au début et à la fin
});

function updateValue(event) {
  const value = props.type === "number" ? Number(event.target.value) : event.target.value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div>
    <label :for="inputId" class="form-label">{{ label }} <span class="text-danger" v-if="required || !optionel">*</span> </label>
    <input :id="inputId" :name="inputId" :type="type" :required="required" :value="modelValue" @input="updateValue" class="form-control" :placeholder="label" :min="min" :max="max" :disabled="disabled" />
    <div v-if="control" class="mt-2 text-danger">{{ control }}</div>
  </div>
</template>
