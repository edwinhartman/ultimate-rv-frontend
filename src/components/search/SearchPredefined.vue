<template>
  <div class="search-predefined">
    <label>Show: </label>
    <select name="" id="" v-model="search_value" @change="search($event.target.value)" class="w-9/12 ml-1 rounded-md">
      <option value="none"></option>
      <option v-for="opt in predefinedSearchTypes" :key="opt.value" :value="opt.value">{{ opt.display }}</option>
    </select>
  </div>
</template>

<script>
import { getPredefinedSearchTypes } from "../../definitions/PredefinedSearchTypes.js"

export default {
  name: "SearchPredefined",
  data() {
    return {
      search_value: "none",
      predefinedSearchTypes: [],
    }
  },
  created() {
    this.predefinedSearchTypes = getPredefinedSearchTypes()
  },
  mounted() {
    this.$store.commit("predefined_search/resetSearchPredefined")
  },
  methods: {
    search(val) {
      this.$store.commit("predefined_search/setSearchPredefined", val)
    },
  },
  watch: {
    "$store.state.predefined_search.searchPredefined": function () {
      this.search_value = this.$store.state.predefined_search.searchPredefined
    },
  },
}
</script>
<style scoped>
div.search-predefined {
  width: 100%;
  font-size: 0.7rem;
  text-align: left;
  padding-left: 0.1rem;
  padding-bottom: 0.1rem;
  margin-top: 0.5rem;
}
div.search-predefined select {
  font-size: 0.65rem;
  border-radius: 0.25rem;
}
</style>
