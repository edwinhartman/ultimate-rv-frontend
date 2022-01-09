<template>
  <div class="secondary-color left-toolbar shadow-right">
    <LocationSearch />
    <div class="toolbar-buttons">
      <div>
        <Popper :interactive="false" :hover="true">
          <button @click="addNewTrip">Add New Trip</button>
          <template #content>
            <div class="tooltip-popup">This will create a new blank trip</div>
          </template>
        </Popper>
      </div>
      <div
        v-if="
          $store.state.activeTrip != null &&
          $store.state.activeTrip.stops.length > 0
        "
      >
        <Popper :interactive="false" :hover="true">
          <button @click="copyToReverse">Copy To Reverse</button>
          <template #content>
            <div class="tooltip-popup">
              This will create a new trip that is the reverse of the active
              trip
            </div>
          </template>
        </Popper>
      </div>
    </div>
    <TripListing />
    <!-- <TripSummary /> -->
  </div>
</template>
<script>
import LocationSearch from "../search/LocationSearch.vue";
import TripListing from "../trip/TripListing.vue";
// import TripSummary from "../route/TripSummary.vue";
import Popper from "vue3-popper";

export default {
  name: "LeftToolbar",
  components: {
    LocationSearch,
    TripListing,
    // TripSummary,
    Popper,
  },

  computed: {
    stopList: {
      get() {
        if (
          this.$store.state.activeTrip != null &&
          this.$store.state.activeTrip.stops != null
        ) {
          return this.$store.state.activeTrip.stops;
        }
        return null;
      },
      set(value) {
        this.$store.dispatch("updateStopList", value);
      },
    },
  },

  methods: {
    deleteStop(route_info, stop_info) {
      this.$store.dispatch("removeStopFromTrip", {
        route_id: route_info.route._id,
        stop_id: stop_info.element._id,
      });
    },

    addNewTrip() {
      this.$store.dispatch("addBlankTrip");
    },
    copyToReverse() {
      this.$store.dispatch("copyActiveTripToReverse");
    },
  },
  created() {
    this.$axios
      .get(process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getTrips")
      .then((res) => {
        //this.menu_items=res.data.menu;
        if (res.data.routes.length == 0) {
          this.$axios({
            method: "post",
            url:
              process.env.VUE_APP_BACKEND_CONNECTION_URI +
              "/createDefaultTrip",
          })
            .then((res) => {
              this.$store.commit("resetValues");
              this.$store.commit("loadTrips", res.data.routes);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$store.commit("loadTrips", res.data.routes);
        }
      })
      .catch((error) => console.log(error));
  },
};
</script>
<style scoped>
div.left-toolbar {
  min-width: 12rem;
  max-width: 16rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  z-index: 80;
  max-height: 97vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
div.toolbar-buttons {
  width: 15vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left: 0.1rem;
  /* position: absolute; */
  /* bottom: 0.2rem; */
  min-width: 12rem;
  max-width: 15rem;
  margin-bottom:0.2rem;
}
div.toolbar-buttons button {
  font-size: 0.6rem;
  margin-right: 0.1rem;
  cursor: pointer;
}
</style>