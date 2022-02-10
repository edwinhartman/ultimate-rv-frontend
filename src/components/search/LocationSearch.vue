<template>
  <div class="main">
    <!-- <input type="text" v-model="searchTerm" placehold="Search..." @keyup.enter="executeSearch" />
    <i class="search icon"></i>
    <button @click="executeSearch">Go</button> -->
    <form class="search-bar" @submit.prevent="executeSearch">
      <input type="search" name="search" v-model="searchTerm" pattern=".*\S.*" autocomplete="off" required />
      <button class="search-btn" type="submit">
        <!-- <span>Search</span> -->
      </button>
    </form>
    <transition name="fade">
      <div class="results" v-show="searchResults.length > 0">
        <div v-for="result in searchResults" :key="result.id" class="search-result" @click="addAnnotationToMap(result)">
          <div class="result-name">{{ result.name }}</div>
          <div class="result-address">{{ result.formattedAddress }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "LocationSearch",
  data() {
    return {
      searchTerm: "",
      searchResults: [],
    }
  },
  watch: {
    searchTerm(newVal, oldVal) {
      if (newVal != "") {
        if (newVal != oldVal) {
          this.executeSearch()
        }
      } else {
        this.searchResults = []
        window.mymapview.removeSearchAnnotations()
      }
    },
    "$store.state.freetext_search.search_results": function (oldVal, newVal) {
      if (newVal.length > 0) {
        this.searchResults = newVal
      } else {
        this.searchResults = []
      }
    },
  },
  methods: {
    executeSearch() {
      window.mymapview.executeMapSearch(this.searchTerm)
    },
    addAnnotationToMap(result) {
      window.mymapview.addAnnotationToMap(result)
      document.activeElement.blur()
    },
  },
}
</script>
<style scoped>
* {
  border: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:root {
  font-size: calc(16px + (24 - 16) * (100vw - 320px) / (1920 - 320));
}
body,
button,
input {
  font: 1em Hind, sans-serif;
  line-height: 1em;
}
div.main {
  display: flex;
  flex-direction: row;
  /* margin-left: 5rem; */
  position: relative;
}
.search-bar {
  width: 10rem;
  height: 1em;
  display: flex;
  margin-top: 0rem;
}
.search-bar input,
.search-btn,
.search-btn:before,
.search-btn:after {
  transition: all 0.25s ease-out;
}
.search-bar input,
.search-btn {
  width: 1.6em;
  height: 1.6em;
}
.search-bar input:invalid:not(:focus),
.search-btn {
  cursor: pointer;
}
.search-bar,
.search-bar input:focus,
.search-bar input:valid {
  width: 100%;
}
.search-bar input:focus,
.search-bar input:not(:focus) + .search-btn:focus {
  outline: transparent;
}
.search-bar {
  /* margin: auto; */
  padding-left: 1.5em;
  padding-right: 1.5em;
  justify-content: center;
  max-width: 30em;
}
.search-bar input {
  background: transparent;
  border-radius: 1.2em;
  box-shadow: 0 0 0 0.4em #171717 inset;
  padding-left: 0.75em;
  padding-right: 0.75em;
  transform: translate(0.5em, 0.5em) scale(0.5);
  transform-origin: 100% 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.search-bar input::-webkit-search-decoration {
  -webkit-appearance: none;
}
.search-bar input:focus,
.search-bar input:valid {
  background: #fff;
  border-radius: 0.375em 0 0 0.375em;
  box-shadow: 0 0 0 0.1em #d9d9d9 inset;
  transform: scale(1);
}
.search-btn {
  background: #171717;
  border-radius: 0 0.75em 0.75em 0 / 0 1.5em 1.5em 0;
  padding-left: 0.75em;
  padding-right: 0.75em;
  position: relative;
  transform: translate(0.25em, 0.25em) rotate(45deg) scale(0.25, 0.125);
  transform-origin: 0 50%;
}
.search-btn:before,
.search-btn:after {
  content: "";
  display: block;
  opacity: 0;
  position: absolute;
}
.search-btn:before {
  border-radius: 50%;
  box-shadow: 0 0 0 0.2em #f1f1f1 inset;
  top: 0.25em;
  left: 0.2em;
  width: 1em;
  height: 1em;
}
.search-btn:after {
  background: #f1f1f1;
  border-radius: 0 0.25em 0.25em 0;
  top: 59%;
  left: 53%;
  width: 0.5em;
  height: 0.25em;
  transform: translate(0.2em, 0) rotate(45deg);
  transform-origin: 0 50%;
}
.search-btn span {
  display: inline-block;
  overflow: hidden;
  width: 1px;
  height: 1px;
}
/* Active state */
.search-bar input:focus + .search-btn,
.search-bar input:valid + .search-btn {
  background: #2762f3;
  border-radius: 0 0.375em 0.375em 0;
  transform: scale(1);
}
.search-bar input:focus + .search-btn:before,
.search-bar input:focus + .search-btn:after,
.search-bar input:valid + .search-btn:before,
.search-bar input:valid + .search-btn:after {
  opacity: 1;
}
.search-bar input:focus + .search-btn:hover,
.search-bar input:valid + .search-btn:hover,
.search-bar input:valid:not(:focus) + .search-btn:focus {
  background: #0c48db;
}
.search-bar input:focus + .search-btn:active,
.search-bar input:valid + .search-btn:active {
  transform: translateY(1px);
}
div.results {
  position: absolute;
  left: 0;
  margin-left: 1.8rem;
  margin-top: 1.65em;
  background-color: white;
  min-width: 12rem;
  max-width: 30rem;
  z-index: 10000;
  border-radius: 0 0 0.5em 0.5em;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
div.result-name {
  font-size: 0.7rem;
  font-weight: bold;
}
div.result-address {
  font-size: 0.5rem;
}
div.search-result {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 0.15rem;
  cursor: pointer;
  margin-right: 0.15rem;
}
div.search-result:hover {
  background-color: #ebebeb;
}
</style>
