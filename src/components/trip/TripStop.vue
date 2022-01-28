<template>
  <div>
    <div class="route-stop" :class="stop.daytrip ? 'daytrip' : ''" :alt="stop.name">
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <img
          class="icon clickable"
          src="/static/red-circle-x.png"
          alt="Remove"
          @click="deleteStop({ route }, { stop })"
        />
        <template #content>
          <div class="tooltip-popup">This will delete the stop permanently</div>
        </template>
      </Popper>
      <div class="stop-name">{{ stopName }}</div>
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <button v-if="stop._id == route.stops[0]._id && !route.firstStopIsDeparture" @click="setAsOrigin({ route })">
          Origin
        </button>
        <template #content>
          <div class="tooltip-popup">This will the first stop as the departure location for the trip</div>
        </template>
      </Popper>
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <img
          v-if="stop._id == route.stops[0]._id && route.firstStopIsDeparture"
          src="/static/origin-icon.png"
          class="icon clickable"
          alt="Origin Location"
          @click="removeAsOrigin({ route })"
        />
        <template #content>
          <div class="tooltip-popup">
            This will remove the first stop as the departure location and current location will be used
          </div>
        </template>
      </Popper>
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <img class="icon clickable" src="/static/zoom-icon.png" @click="zoomToRegion()" />
        <template #content>
          <div class="tooltip-popup">This will zoom the map to the region surrounding this stop</div>
        </template>
      </Popper>
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <img
          v-if="stop._id != route.stops[0]._id && stop._id != route.stops[route.stops.length - 1]._id"
          @click="updateDaytrip({ route }, { stop })"
          class="icon clickable"
          src="/static/daytrip-icon.png"
          alt="Day Trip"
        />
        <template #content>
          <div class="tooltip-popup">
            This will set the stop to be a daytrip, so that it will be excluded from the main route
            calculation/navigation
          </div>
        </template>
      </Popper>
      <Popper v-if="route.active && stop.comments != null && stop.comments != ''" :interactive="false" :hover="true">
        <img class="icon" src="/static/info-icon.png" alt="Comments" />
        <template #content>
          <div class="tooltip-popup">
            {{ stop.comments }}
          </div>
        </template>
      </Popper>
      <Popper :interactive="false" :hover="true" v-if="route.active">
        <div
          v-if="stopIdx != route.stops.length - 1"
          class="calendar-icon clickable"
          @click="setDate({ route }, { stop })"
        >
          <img class="icon mr-1" src="/static/calendar-icon.png" alt="Calendar" />
          <div v-if="route.dates.length > stopIdx && route.dates[stopIdx] != null && route.dates[stopIdx] != ''">
            {{ getDay(route.dates[stopIdx]) }}
          </div>
        </div>
        <template #content>
          <div class="tooltip-popup">This will allow you to associate departure dates for the specific location</div>
        </template>
      </Popper>
    </div>
    <div v-if="hasAltStop" class="alternative-stop route-stop">
      <img src="/static/alt-stop-icon.png" class="icon" alt="Alt" />Alt: {{ stop.alt_stop.name }}
    </div>
  </div>
</template>
<script>
import Popper from "vue3-popper"

export default {
  name: "TripStop",
  components: {
    Popper,
  },
  props: {
    stop_prop: {
      type: Object,
      required: true,
    },
    route_prop: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      stop: this.stop_prop,
      route: this.route_prop,
    }
  },
  computed: {
    hasAltStop() {
      if (this.stop.alt_stop != null) {
        console.log("has alt stop")
        return true
      }
      console.log("does not have alt stop")
      return false
    },
    stopName() {
      if (this.route.active) {
        if (this.stop.daytrip && this.stop.name.length > 20) {
          return this.stop.name.substr(0, 20) + "..."
        } else if (!this.stop.daytrip && this.stop.name.length > 28) {
          return this.stop.name.substr(0, 28) + "..."
        }
      }
      return this.stop.name
    },
    stopIdx() {
      let idx = -1
      for (let i = 0; i < this.route.stops.length; i++) {
        if (this.stop._id === this.route.stops[i]._id) {
          idx = i
          break
        }
      }
      return idx
    },
  },
  watch: {
    route_prop: function () {
      this.route = this.route_prop
    },
  },
  methods: {
    deleteStop(route_info, stop_info) {
      this.$store.dispatch("removeStopFromTrip", {
        route_id: route_info.route._id,
        stop_id: stop_info.stop._id,
      })
    },
    setAsOrigin(route) {
      this.$store.dispatch("setAsOrigin", { route: route, isOrigin: true })
    },
    removeAsOrigin(route) {
      this.$store.dispatch("setAsOrigin", { route: route, isOrigin: false })
    },
    zoomToRegion() {
      //console.log(this.element)
      this.$store.commit("setNewMapRegion", {
        centerLat: this.stop.coordinate.latitude,
        centerLon: this.stop.coordinate.longitude,
        diffLat: 0.25,
        diffLon: 0.25,
      })
    },
    setDate(route_info, stop_info) {
      this.$store.dispatch("editTripStopDate", {
        route: route_info,
        stop: stop_info,
        stop_idx: this.stopIdx,
      })
    },
    getDay(d) {
      var date = d.substring(0, 10).split("-")
      date = date[1] + "-" + date[2] + "-" + date[0]
      let d1 = new Date(date)
      return d1.getDate()
    },
    updateDaytrip() {
      this.stop.daytrip = !this.stop.daytrip
      this.$store.dispatch("setStopDayTrip", {
        route: this.route,
        stop: this.stop,
      })
    },
  },
}
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
div.route-stop {
  font-size: 0.65rem;
  text-align: left;
  margin-left: 0.2rem;
  display: flex;
  flex-direction: row;
}
div.route-stop img:first-child {
  margin-right: 0.25rem;
}
div.stop-name {
  max-width: 11rem;
}
div.calendar-icon {
  position: relative;
}
div.calendar-icon img {
  position: absolute;
  left: 0;
  top: 0;
}
div.calendar-icon div {
  position: absolute;
  left: 0;
  top: 0;
  color: red;
  font-weight: 900;
  margin-left: 0;
  margin-top: 0;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.7);
  width: 0.85rem;
  text-align: center;
}
div.daytrip {
  margin-left: 1rem;
}
div.alternative-stop {
  margin-left: 1rem;
}
</style>
