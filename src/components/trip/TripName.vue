<template>
  <div>
    <ModalPopup
      :yesNoOption="true"
      v-if="showRemoveTripPopup"
      @yesAnswer="confirmRemoveTrip(true)"
      @noAnswer="confirmRemoveTrip(false)"
    >
      <div>Are you sure that you want to remove this route?</div>
    </ModalPopup>
    <ModalPopup
      :yesNoOption="true"
      v-if="showArchiveTripPopup"
      @yesAnswer="confirmArchiveTrip(true)"
      @noAnswer="confirmArchiveTrip(false)"
    >
      <div>
        You are about to archive this route.<br />You will not be able to make
        any changes until you restore it.<br />Do you want to continue?
      </div>
    </ModalPopup>
    <ClickToEdit
      :value="route.name"
      @input="updateTripName"
      :identifier="route._id"
      :active="route.active"
      :class="route.active ? 'font-bold color-fg-yellow' : 'font-normal'"
      class="route-name"
    />
    <Popper :interactive="false" :hover="true">
      <button
        v-if="!route.active"
        @click="setTripActive(route._id)"
        class="bg-green fg-yellow clickable"
      >
        Set Active
      </button>
      <template #content>
        <div class="tooltip-popup">
          This will set this route as the active route to modify it
        </div>
      </template>
    </Popper>
    <Popper :interactive="false" :hover="true">
      <button
        v-bind:class="{
          'bg-gray-700  text-gray-500 cursor-not-allowed':
            $store.state.routeCalculateInProcess,
          'bg-yellow-500 text-blue-900 clickable':
            !$store.state.routeCalculateInProcess,
        }"
        v-if="
          ((route.stops.length > 0 && !route.firstStopIsDeparture) ||
            (route.firstStopIsDeparture && route.stops.length > 1)) &&
          route.active
        "
        @click="calculateTrip(route)"
        :disabled="$store.state.routeCalculateInProcess"
      >
        {{ calculateButtonName }}
      </button>
      <template #content>
        <div class="tooltip-popup">
          This will calculate the shortest route based on the selected stops
        </div>
      </template>
    </Popper>
    <Popper :interactive="false" :hover="true">
      <button
        v-if="
          ((route.stops.length > 0 && !route.firstStopIsDeparture) ||
            (route.firstStopIsDeparture && route.stops.length > 1)) &&
          route.active
        "
        @click="zoomToActiveTrip()"
        class="bg-blue fg-yellow clickable"
      >
        Zoom To Trip
      </button>
      <template #content>
        <div class="tooltip-popup">
          This will zoom the map to show the complete route
        </div>
      </template>
    </Popper>
    <Popper :interactive="false" :hover="true">
      <button
        v-if="!route.active && !route.system"
        @click="archiveTrip(route._id)"
        class="clickable"
      >
        Archive
      </button>
      <template #content>
        <div class="tooltip-popup">This will archive the route</div>
      </template>
    </Popper>
    <Popper :interactive="false" :hover="true">
      <button @click="removeTrip(route._id)" class="bg-red fg-white clickable">
        Remove
      </button>
      <template #content>
        <div class="tooltip-popup">This will delete the route permanently</div>
      </template>
    </Popper>
    <Popper :interactive="false" :hover="true" v-if="calendarDatesSet">
      <button
        @click="downloadCalendar(route._id)"
        class="bg-blue fg-white clickable"
      >
        Download
      </button>
      <template #content>
        <div class="tooltip-popup">
          This will download the calendar file for this route
        </div>
      </template>
    </Popper>
    <button
      v-if="$store.state.adminToken != null && !route_prop.system && !$store.state.hideAdminFunctions"
      @click="setTripAsSystemTrip(route._id)"
    >
      System
    </button>
  </div>
</template>
<script>
import ClickToEdit from "../templates/ClickToEdit.vue";
import ModalPopup from "../templates/ModalPopup.vue";
import Popper from "vue3-popper";
import { generateCalendarFile } from "../../business_logic/CalendarFiles";

export default {
  name: "TripName",
  components: {
    ClickToEdit,
    ModalPopup,
    Popper,
  },

  props: {
    route_prop: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      route: this.route_prop,
      showRemoveTripPopup: false,
      routeToRemove: null,
      routeToArchive: null,
      showArchiveTripPopup: false,
    };
  },
  computed: {
    calculateButtonName() {
      if (this.route.polyline.length > 0) {
        return "Re-Calculate";
      }
      return "Calculate";
    },
    calendarDatesSet() {
      let found = false;
      if (this.route.dates.length > 0) {
        for (let i = 0; i < this.route.dates.length; i++) {
          if (this.route.dates[i] != null && this.route.dates[i] != "") {
            found = true;
            break;
          }
        }
      }
      return found;
    },
  },
  watch: {
    route_prop: function () {
      this.route = this.route_prop;
    },
  },
  methods: {
    setTripActive(id) {
      this.$store.dispatch("activateTrip", id).then(()=>{
        this.zoomToActiveTrip()
      });
    },
    updateTripName(oldValue, newTripName, identifier) {
      let payload = {
        identifier: identifier,
        oldValue: oldValue,
        newValue: newTripName,
      };
      this.$store.dispatch("updateTripName", payload);
    },
    calculateTrip(route) {
      this.$store.dispatch("calculateTrip", route);
      this.zoomToActiveTrip();
    },
    removeTrip(id) {
      this.routeToRemove = id;
      this.showRemoveTripPopup = true;
      //this.$store.dispatch("removeTrip",id);
    },
    confirmRemoveTrip(doRemove) {
      if (doRemove) {
        this.$store.dispatch("removeTrip", this.routeToRemove);
      }
      this.routeToRemove = null;
      this.showRemoveTripPopup = false;
    },
    archiveTrip(id) {
      this.routeToArchive = id;
      this.showArchiveTripPopup = true;
    },
    confirmArchiveTrip(doArchive) {
      if (doArchive) {
        this.$store.dispatch("archiveTrip", this.routeToArchive);
      }
      this.routeToArchive = null;
      this.showArchiveTripPopup = false;
    },
    zoomToActiveTrip() {
      var lowestLat = 9999999;
      var lowestLon = 9999999;
      var highestLat = -9999999;
      var highestLon = -9999999;
      let stopStartIdx = 0;
      if (this.$store.state.activeTrip.searchPredefined != null && this.$store.state.activeTrip.searchPredefined) {
        lowestLat = this.$store.state.activeTrip.stops[0].coordinate.latitude;
        highestLat = this.$store.state.activeTrip.stops[0].coordinate.latitude;
        lowestLon = this.$store.state.activeTrip.stops[0].coordinate.longitude;
        highestLon =
          this.$store.state.activeTrip.stops[0].coordinate.longitude;
        stopStartIdx = 1;
      } else {
        lowestLat = this.$store.state.currentLocation.coords.latitude;
        highestLat = this.$store.state.currentLocation.coords.latitude;
        lowestLon = this.$store.state.currentLocation.coords.longitude;
        highestLon = this.$store.state.currentLocation.coords.longitude;
      }

      for (
        let i = stopStartIdx;
        i < this.$store.state.activeTrip.stops.length;
        i++
      ) {
        if (
          this.$store.state.activeTrip.stops[i].coordinate.latitude < lowestLat
        ) {
          lowestLat =
            this.$store.state.activeTrip.stops[i].coordinate.latitude;
        }
        if (
          this.$store.state.activeTrip.stops[i].coordinate.latitude >
          highestLat
        ) {
          highestLat =
            this.$store.state.activeTrip.stops[i].coordinate.latitude;
        }
        if (
          this.$store.state.activeTrip.stops[i].coordinate.longitude <
          lowestLon
        ) {
          lowestLon =
            this.$store.state.activeTrip.stops[i].coordinate.longitude;
        }
        if (
          this.$store.state.activeTrip.stops[i].coordinate.longitude >
          highestLon
        ) {
          highestLon =
            this.$store.state.activeTrip.stops[i].coordinate.longitude;
        }
      }

      var centerLat = (highestLat - lowestLat) / 2 + lowestLat;
      var centerLon = (highestLon - lowestLon) / 2 + lowestLon;
      var diffLat = (highestLat - lowestLat) * 1.1;
      var diffLon = (highestLon - lowestLon) * 1.1;
      this.$store.commit("setNewMapRegion", {
        centerLat: centerLat,
        centerLon: centerLon,
        diffLat: diffLat,
        diffLon: diffLon,
      });
    },
    downloadCalendar(route_id) {
      let route_idx = -1;
      for (let i = 0; i < this.$store.state.routes.length; i++) {
        if (this.$store.state.routes[i]._id === route_id) {
          route_idx = i;
          break;
        }
      }

      if (route_idx > -1) {
        generateCalendarFile(this.$store.state.routes[route_idx], (txt) => {
          window.open("data:text/calendar;charset=utf8," + escape(txt));
        });
      }
    },
    setTripAsSystemTrip(route_id) {
      this.$store.dispatch("setTripAsSystemTrip", { route_id: route_id });
    },
  },
};
</script>
<style scoped>
button {
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  font-size: 0.45rem;
  margin-bottom: 0.2rem;
  padding-left: 0.15rem;
  padding-right: 0.15rem;
}
.route-name {
  background-color: rgb(160, 160, 160);
  border-radius: 0.25rem 0.25rem 0 0;
  color: white;
  text-align: center;
}
</style>