<template>
  <div class="text-left pl-2" v-if="renderComponent">
    <transition name="fade">
      <!-- <div v-if="activeTrips.length > 0"> -->
      <div v-if="$store.state.activeTrip">
        <TripOverview v-for="route in activeTrips" :key="route._id" :route_prop="route" />
      </div>
    </transition>

    <div v-if="!$store.state.activeTrip" class="formatted-text">
      No Trip Selected. Please use the "Open Trip" or "Add New Trip" button above.
    </div>
  </div>
</template>
<script>
import TripOverview from "./TripOverview.vue"

export default {
  name: "TripListing",
  components: {
    TripOverview,
  },
  data() {
    return {
      routes: [],
      showArchivedTrips: false,
      showSystemTrips: false,
      adminToken: this.$store.state.adminToken,
      activeTrips: [],
      renderComponent: true,
    }
  },
  computed: {
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
      this.renderComponent = false
      this.routes = this.$store.state.routes
      this.activeTrips = this.routes
        .filter((r) => r.active)
        .sort((a, b) => {
          if (a.active == b.active) {
            return a.name < b.name ? 1 : -1
          }
          return a.active - b.active
        })
        .reverse()
      this.$nextTick(() => {
        this.renderComponent = true
      })
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
.formatted-text {
  font-size: 0.75rem;
  font-style: italic;
}
</style>
