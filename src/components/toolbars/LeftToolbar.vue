<template>
  <div
    class="secondary-color left-toolbar shadow-right"
    id="left_toolbar"
    :class="!this.isPhone() || $store.state.toolbars.showLeftToolbar ? 'active' : ''"
  >
    <div class="toolbar-buttons">
      <div>
        <Popper :interactive="false" :hover="true">
          <button @click="openExistingTrip">Open Trip</button>
          <template #content>
            <div class="tooltip-popup">This will show existing trips to open</div>
          </template>
        </Popper>
      </div>
      <div>
        <Popper :interactive="false" :hover="true">
          <button @click="addNewTrip">Add New Trip</button>
          <template #content>
            <div class="tooltip-popup">This will create a new blank trip</div>
          </template>
        </Popper>
      </div>
      <div v-if="$store.state.activeTrip != null && $store.state.activeTrip.stops.length > 0">
        <Popper :interactive="false" :hover="true">
          <button @click="copyToReverse">Copy To Reverse</button>
          <template #content>
            <div class="tooltip-popup">This will create a new trip that is the reverse of the active trip</div>
          </template>
        </Popper>
      </div>
    </div>
    <TripListing />
    <!-- <TripSummary /> -->
    <TripSummary2 />
    <SearchAlongTrip />
    <div v-if="this.isPhone() || this.isTablet()">
      <SearchPredefined />
      <GeneralSettings />
      <RVListing
        v-if="$store.state.rvs.length > 0 && $store.state.settings.showRVSettings"
        @add_new="openRVEditPanel"
        @edit_active_rv="editActiveRV"
        :edit_active="addNewRV || editRV != null"
      />
      <RVSettings v-if="$store.state.rvs.length == 0 || addNewRV" @close_panel="closeRVEditPanel" :edit_rv="editRV" />
    </div>
  </div>
</template>
<script>
import TripListing from "../trip/TripListing.vue"
import TripSummary2 from "../trip/TripSummary2.vue"
import SearchAlongTrip from "../trip/SearchAlongTrip.vue"
import Popper from "vue3-popper"
import RVSettings from "../rv/RVSettings.vue"
import RVListing from "../rv/RVListing.vue"
import SearchPredefined from "../search/SearchPredefined.vue"
import GeneralSettings from "../other/GeneralSettings.vue"

export default {
  name: "LeftToolbar",
  components: {
    TripListing,
    TripSummary2,
    SearchAlongTrip,
    Popper,
    RVSettings,
    RVListing,
    SearchPredefined,
    GeneralSettings,
  },
  data() {
    return {
      addNewRV: false,
      editRV: null,
    }
  },

  computed: {
    stopList: {
      get() {
        if (this.$store.state.activeTrip != null && this.$store.state.activeTrip.stops != null) {
          return this.$store.state.activeTrip.stops
        }
        return null
      },
      set(value) {
        this.$store.dispatch("updateStopList", value)
      },
    },
  },

  methods: {
    deleteStop(route_info, stop_info) {
      this.$store.dispatch("removeStopFromTrip", {
        route_id: route_info.route._id,
        stop_id: stop_info.element._id,
      })
    },

    addNewTrip() {
      this.$store.dispatch("addBlankTrip")
    },
    copyToReverse() {
      this.$store.dispatch("copyActiveTripToReverse")
    },
    openExistingTrip() {
      this.$store.commit("dialogs/setShowOpenExistingTrip", true)
    },
    editActiveRV() {
      this.addNewRV = true
      this.editRV = this.$store.state.activeRV
    },
    closeRVEditPanel() {
      this.addNewRV = false
      this.editRV = null
    },
    openRVEditPanel() {
      this.addNewRV = true
    },
  },
  created() {
    this.$axios
      .get(process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getTrips")
      .then((res) => {
        // console.log(JSON.stringify(res.data.routes))
        // console.log(res.data.routes)
        //this.menu_items=res.data.menu;
        if (res.data.routes.length == 0) {
          this.$axios({
            method: "post",
            url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/createDefaultTrip",
          })
            .then((res) => {
              this.$store.commit("resetValues")
              this.$store.commit("loadTrips", res.data.routes)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.$store.commit("loadTrips", res.data.routes)
        }
      })
      .catch((error) => console.log(error))
    if (this.isPhone() || this.isTablet()) {
      this.$store.dispatch("loadRVs")
    }
  },
}
</script>
<style scoped>
div.left-toolbar {
  /* min-width: 12rem;
  max-width: 16rem; */
  width: var(--side-toolbar-width);
  /* padding-top: 0.5rem; */
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  z-index: 80;
  height: var(--main-height);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--main-bg-color);
}
/* Phone - Portrait */
@media (min-device-width: 375px) and (max-device-width: 812px) and (orientation: portrait) {
  div.left-toolbar {
    min-width: 0.01rem;
    max-width: 0.01rem;
    transition: min-width 0.5s ease-in-out;
  }
  div.left-toolbar * {
    display: none;
  }
  div.left-toolbar.active {
    min-width: 20rem;
  }
  div.left-toolbar.active * {
    display: inline-block;
  }
}
div.toolbar-buttons {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left: 0.1rem;
  min-width: 12rem;
  max-width: 15rem;
  margin-bottom: 0.2rem;
  margin-top: 0.5rem;
}
div.toolbar-buttons button {
  font-size: 0.6rem;
  margin-right: 0.1rem;
  margin-left: 0.1rem;
  cursor: pointer;
  box-shadow: 0.15rem 0.15rem 0.5rem rgba(80, 80, 80, 0.5);
}
</style>
