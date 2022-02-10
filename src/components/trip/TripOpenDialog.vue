<template>
  <div class="main">
    <Tabs v-model="active">
      <Tab :title="active_title">
        <div class="trip-grid">
          <OpenTripCard v-for="trip in activeTrips" :key="trip._id" :trip="trip" @doRefresh="refreshData" />
        </div>
      </Tab>
      <Tab :title="archived_title">
        <div class="trip-grid">
          <OpenTripCard v-for="trip in archivedTrips" :key="trip._id" :trip="trip" @doRefresh="refreshData" />
        </div>
      </Tab>
      <Tab
        :title="system_title"
        v-if="
          this.$store.state.adminToken != null &&
          $store.state.settings.showSystemTrips &&
          !$store.state.settings.hideAdminFunctions
        "
      >
        <div class="trip-grid"><OpenTripCard v-for="trip in systemTrips" :key="trip._id" :trip="trip" /></div>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import Tabs from "../common/Tabs.vue"
import Tab from "../common/Tab.vue"
import { ref } from "@vue/reactivity"
import axios from "axios"

import OpenTripCard from "./OpenTripCard.vue"
export default {
  name: "TripOpenDialog",
  setup() {
    const active = ref(0)
    const refresh_var = true

    return { active, refresh_var }
  },
  components: {
    Tabs,
    Tab,
    OpenTripCard,
  },
  data() {
    return {
      snapshots: [],
      active_title: "Active ",
      archived_title: "Archived",
      system_title: "System",
    }
  },
  computed: {
    activeTrips() {
      return this.snapshots.filter((s) => !s.archived && !s.system)
    },
    archivedTrips() {
      return this.snapshots.filter((s) => s.archived && !s.system)
    },
    systemTrips() {
      return this.snapshots.filter((s) => !s.archived && s.system)
    },
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      axios({
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getTripSnapshots",
        method: "get",
      }).then((res) => {
        this.snapshots = res.data.snapshots
        this.active_title = "Active [" + this.activeTrips.length + "]"
        this.archived_title = "Archived [" + this.archivedTrips.length + "]"
        this.system_title = "System [" + this.systemTrips.length + "]"
      })
    },
  },
}
</script>
<style scoped>
div.main {
  width: 50rem;
  height: 35rem;
}
div.trip-grid {
  width: 100%;
  height: 33rem;
  text-align: left;
  overflow-y: auto;
  /* border: 1px solid black; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
@media (min-device-width: 375px) and (max-device-width: 812px) {
  div.main {
    width: 20rem;
  }
  div.trip-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
