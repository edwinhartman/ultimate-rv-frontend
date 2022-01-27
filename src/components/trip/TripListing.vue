<template>
  <div class="text-left pl-2">
    <TripOverview v-for="route in activeTrips" :key="route._id" :route_prop="route" />

    <div v-if="archivedTrips.length > 0 && $store.state.settings.showArchivedTrips" class="archived-routes-div">
      <div class="font-bold relative">
        Archived Trips
        <img
          v-if="!showArchivedTrips"
          src="/static/arrow-down-icon.png"
          class="icon min-max-button2 clickable"
          @click="toggleShowArchivedTrips()"
        /><img
          v-if="showArchivedTrips"
          src="/static/arrow-up-icon.png"
          class="icon min-max-button2 clickable"
          @click="toggleShowArchivedTrips()"
        />
      </div>
      <div v-if="showArchivedTrips">
        <ArchivedTrips v-for="route in archivedTrips" :key="route._id" :route_prop="route" />
      </div>
    </div>
    <div
      v-if="adminToken != null && $store.state.settings.showSystemTrips && !$store.state.settings.hideAdminFunctions"
      class="system-routes-div"
    >
      <div class="font-bold relative">
        System Trips
        <img
          v-if="!showSystemTrips"
          src="/static/arrow-down-icon.png"
          class="icon min-max-button2 clickable"
          @click="toggleShowSystemTrips()"
        /><img
          v-if="showSystemTrips"
          src="/static/arrow-up-icon.png"
          class="icon min-max-button2 clickable"
          @click="toggleShowSystemTrips()"
        />
      </div>
      <div v-if="showSystemTrips">
        <TripOverview v-for="route in systemTrips" :key="route._id" :route_prop="route" />
      </div>
    </div>
  </div>
</template>
<script>
import TripOverview from "./TripOverview.vue"
import ArchivedTrips from "./ArchivedTrips.vue"

export default {
  name: "TripListing",
  components: {
    TripOverview,
    ArchivedTrips,
  },
  data() {
    return {
      routes: [],
      showArchivedTrips: false,
      showSystemTrips: false,
      adminToken: this.$store.state.adminToken,
    }
  },
  computed: {
    activeTrips() {
      return this.routes
        .filter((r) => (r.archived == null || !r.archived) && !r.system)
        .sort((a, b) => {
          if (a.active == b.active) {
            return a.name < b.name ? 1 : -1
          }
          return a.active - b.active
        })
        .reverse()
    },
    archivedTrips() {
      return this.routes
        .filter((r) => r.archived != null && r.archived && !r.system)
        .sort((a, b) => {
          if (a.active == b.active) {
            return a.name < b.name ? 1 : -1
          }
          return a.active - b.active
        })
        .reverse()
    },
    systemTrips() {
      return this.routes
        .filter((r) => r.system)
        .sort((a, b) => {
          if (a.active == b.active) {
            return a.name < b.name ? 1 : -1
          }
          return a.active - b.active
        })
        .reverse()
    },
    expandCollapseValue() {
      if (this.showArchivedTrips) {
        return "[collapse]"
      } else {
        return "[expand]"
      }
    },
  },
  watch: {
    "$store.state.routes": function () {
      this.routes = this.$store.state.routes
    },
  },
  methods: {
    toggleShowArchivedTrips() {
      this.showArchivedTrips = !this.showArchivedTrips
    },
    toggleShowSystemTrips() {
      this.showSystemTrips = !this.showSystemTrips
    },
  },
}
</script>
<style scoped>
.archived-routes-div,
.system-routes-div {
  font-size: 0.7rem;
  margin-left: 0.1rem;
  margin-top: 0.2rem;
  border: solid rgb(80, 80, 80) 1px;
  border-radius: 0.25rem;
  padding-left: 0.1rem;
  box-shadow: 0.1em 0.1em rgba(110, 110, 110, 0.5);
  padding-bottom: 0.1rem;
}
</style>
