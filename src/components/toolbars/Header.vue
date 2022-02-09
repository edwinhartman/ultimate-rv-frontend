<template>
  <div class="header-main">
    <ul>
      <!-- <li class="tab-item"><a href="#home">Home</a></li> -->
      <li class="tab-item"><a href="#account" @click="activateAccountMaintenance">Account</a></li>
      <li class="tab-item"><a href="#about" @click="showAbout">About</a></li>
      <li v-if="$store.state.adminToken != null && !$store.state.settings.hideAdminFunctions" class="tab-item">
        <a href="/admin">Admin</a>
      </li>
    </ul>
    <div class="location-search">
      <LocationSearch />
    </div>
    <div class="reset-button" @click="xClicked()">X</div>
  </div>
</template>

<script>
import LocationSearch from "../search/LocationSearch.vue"

export default {
  name: "Header",
  data() {
    return {
      x_clicked_cnt: 0,
    }
  },
  components: {
    LocationSearch,
  },
  methods: {
    xClicked() {
      this.x_clicked_cnt++
      if (this.x_clicked_cnt > 5) {
        this.x_clicked_cnt = 0
        this.$store.commit("resetAllHungupValues")
      }
    },
    activateAccountMaintenance(event) {
      console.log("activateAccountMaintenance")
      event.preventDefault()
      this.$store.commit("setShowAccountMaintenance", !this.$store.state.accountMaintenanceActive)
    },
    showAbout(event) {
      event.preventDefault()
      this.$store.commit("setShowAbout", !this.$store.state.showAbout)
    },
  },
}
</script>
<style scoped>
.header-main {
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: var(--main-bg-color);
  min-height: 2rem;
  max-height: 2.5rem;
  padding: 0;
  position: relative;
  z-index: 10000;
  box-shadow: 0 0.25rem 0.5rem rgba(80, 80, 80, 0.2);
}
ul {
  list-style: none;
  margin: 0;
  margin-left: 13rem;
}
.tab-item {
  float: left;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  margin-right: 0.08rem;
  min-width: 5rem;
  border-radius: 0 0 0.25rem 0.25rem;
  border-left: solid rgb(139, 139, 139) 1px;
  border-right: solid rgb(139, 139, 139) 1px;
  border-bottom: solid rgb(139, 139, 139) 1px;
  z-index: 10;
  background-color: var(--tab-bg-color);
  position: relative;
  cursor: pointer;
}
.tab-item::after {
  content: "";
  width: 100%;
  height: 130%;
  position: absolute;
  left: 0;
  top: -0.4rem;
  border-radius: 0 0 0.25rem 0.25rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(80, 80, 80, 0.3);
  z-index: -1;
}
li:hover {
  background-color: var(--tab-bg-color-hover);
  font-weight: bolder;
}
.tab-item:hover::after {
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(80, 80, 80, 0.5);
}
li:hover > a {
  color: var(--tab-fg-color-hover);
}
a {
  text-decoration: none;
  color: rgb(80, 80, 80);
}
.reset-button {
  position: absolute;
  right: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  color: var(--main-bg-color);

  z-index: 99999;
}
div.location-search {
  position: absolute;
  right: 0.75rem;
}
</style>
