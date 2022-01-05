<template>
  <input
    @input="check()"
    type="checkbox"
    :checked="checked"
    :id="fieldId"
    class="mr-2 hidden"
    v-bind="$attrs"
  />
  <label
    :for="fieldId"
    class="flex flex-row items-center font-bold text-gray-800 hover:text-blue-500 cursor-pointer select-none"
  >
    <i
      class="fa mr-2"
      :class="{
        'fa-check-square text-blue-600 hover:text-blue-700': checked,
        'fa-square text-gray-500 hover:text-gray-600': !checked,
      }"
    ></i>
    {{ value }}
  </label>
</template>

<script>
import { computed } from "vue";

export default {
  emits: ["update:names"],
  props: {
    value: {
      type: String,
      required: true,
    },
    fieldId: {
      type: String,
      required: true,
    },
    names: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const checked = computed(() => props.names.includes(props.fieldId));

    function check() {
      let updatedNames = [...props.names];
      if (this.checked) {
        updatedNames.splice(updatedNames.indexOf(props.fieldId), 1);
      } else {
        updatedNames.push(props.fieldId);
      }
      
      context.emit("update:names", updatedNames);
    }

    return {
      check,
      checked,
    };
  },
};
</script>

<style>
</style>
