<template>
  <div class="header-main">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#account" @click="activateAccountMaintenance">Account</a></li>
      <li><a href="#about" @click="showAbout">About</a></li>
      <li v-if="$store.state.adminToken != null && !$store.state.settings.hideAdminFunctions">
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
  background-color: rgb(221, 221, 221);
  min-height: 2rem;
  max-height: 2.5rem;
  padding: 0;
}
ul {
  list-style: none;
  margin: 0;
}
li {
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
  background-color: rgb(221, 221, 221);
  box-shadow: 0.25rem 0.25rem rgba(80, 80, 80, 0.2);
  cursor: pointer;
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
  color: rgb(221, 221, 221);

  z-index: 99999;
}
div.location-search {
  position: absolute;
  right: 0.75rem;
}
</style>
