<template>
  <div>
    <input
      type="text"
      v-model="searchTerm"
      placehold="Search..."
      @keyup.enter="executeSearch"
    />
    <button @click="executeSearch">Go</button>
  </div>
</template>
<script>
export default {
  name: "LocationSearch",
  data() {
    return {
      searchTerm: "",
    }
  },
  methods: {
    executeSearch() {
      this.$store.commit("updateKeywords", this.searchTerm)
      this.searchTerm = ""
    },
  },
}
</script>
<style scoped>
div {
  width: 100%;
  text-align: left;
  padding-left: 1rem;
  font-size: 0.8rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}
</style>
