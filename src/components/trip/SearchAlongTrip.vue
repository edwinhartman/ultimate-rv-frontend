<template>
  <div
    v-if="
      $store.state.activeTrip != null &&
      $store.state.activeTrip.polyline != null &&
      $store.state.activeTrip.polyline.length > 0
    "
  >
    <div class="search-along-route-banner secondary-color-70">
      <div @click="expanded = !expanded">Search Along Trip</div>
      <img
        v-if="!expanded"
        @click="expanded = true"
        src="/static/arrow-down-icon.png"
        class="dropdown-icon icon clickable"
      />

      <img
        v-if="expanded"
        @click="expanded = false"
        src="/static/arrow-up-icon.png"
        class="dropdown-icon icon clickable"
      />
      <div v-if="expanded">
        <select name="" id="" v-model="searchTerm">
          <option v-for="opt in predefinedSearchTypes" :key="opt.value" :value="opt.value">
            {{ opt.display }}
          </option>
        </select>
        <br />
        <select name="" id="" v-model="searchDistance">
          <option value="15">15 Miles</option>
          <option value="30">30 Miles</option>
          <option value="50">50 Miles</option>
          <option value="75" v-if="searchBeforeAfterAround != 'around'">75 Miles</option>
          <option value="100" v-if="searchBeforeAfterAround != 'around'">100 Miles</option>
          <option value="150" v-if="searchBeforeAfterAround != 'around'">150 Miles</option>
          <option value="200" v-if="searchBeforeAfterAround != 'around'">200 Miles</option>
          <option value="250" v-if="searchBeforeAfterAround != 'around'">250 Miles</option>
          <option value="300" v-if="searchBeforeAfterAround != 'around'">300 Miles</option>
          <option value="350" v-if="searchBeforeAfterAround != 'around'">350 Miles</option>
          <option value="400" v-if="searchBeforeAfterAround != 'around'">400 Miles</option>
          <option value="450" v-if="searchBeforeAfterAround != 'around'">450 Miles</option>
          <option value="500" v-if="searchBeforeAfterAround != 'around'">500 Miles</option>
        </select>
        <select name="" id="" v-model="searchBeforeAfterAround">
          <option value="around">Around</option>
          <option value="before" v-if="searchStop != null && searchStop > 0">Before</option>
          <option value="after" v-if="searchStop != null && searchStop < $store.state.activeTrip.stops.length - 1">
            After
          </option>
        </select>
        <br />
        <select name="" id="" v-model="searchStop">
          <option v-for="(stop, idx) in mainTripStops" :key="stop._id" :value="idx">
            {{ trimStopName(stop.name) }}
          </option>
        </select>
        <br />
        <div>
          <button
            v-bind:class="{
              'bg-green-700  text-white cursor-pointer': searchEnabled,
              'bg-gray-400 text-gray-500 cursor-not-allowed': !searchEnabled,
            }"
            @click="searchAlongTrip()"
            :disabled="searchEnabled == false"
          >
            Go
          </button>
          <button @click="clearSearch()">Clear</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPredefinedSearchTypes } from "../../definitions/PredefinedSearchTypes.js"

export default {
  name: "SearchAlongTrip",
  computed: {
    searchEnabled() {
      if (this.searchTerm != "" && this.searchDistance != 0 && this.searchStop != null) {
        return true
      }
      return false
    },
    mainTripStops() {
      return this.$store.state.activeTrip.stops.filter((s) => !s.daytrip)
    },
  },
  data() {
    return {
      searchTerm: "",
      searchDistance: 0,
      searchStop: null,
      searchBeforeAfterAround: "",
      predefinedSearchTypes: [],
      expanded: false,
      routeSummaryShown: false,
    }
  },
  created() {
    this.predefinedSearchTypes = getPredefinedSearchTypes()
    this.routeSummaryShown = this.$store.state.settings.alwaysShowTripSummary
  },
  watch: {
    "$store.state.settings.alwaysShowTripSummary": function () {
      this.routeSummaryShown = this.$store.state.settings.alwaysShowTripSummary
    },
  },
  methods: {
    trimStopName(stopName) {
      if (stopName.length > 30) {
        return stopName.substr(0, 27) + "..."
      }
      return stopName
    },
    clearSearch() {
      this.searchTerm = ""
      this.searchDistance = 0
      this.searchStop = null
      this.searchBeforeAfterAround = ""
      this.$store.commit("setSearchPredefined", "None")
    },
    searchAlongTrip() {
      if (this.searchBeforeAfterAround == "after" || this.searchBeforeAfterAround == "before") {
        let sectionIdx = -1
        let searchLength = this.searchDistance * 1600
        var currentDistance = 0
        let offset = -1

        if (this.searchBeforeAfterAround == "before") {
          sectionIdx = this.searchStop - 1
          for (let i = this.$store.state.activeTrip.polyline[sectionIdx].length - 1; i > 0; i--) {
            currentDistance += this.distance(
              this.$store.state.activeTrip.polyline[sectionIdx][i][0],
              this.$store.state.activeTrip.polyline[sectionIdx][i][1],
              this.$store.state.activeTrip.polyline[sectionIdx][i - 1][0],
              this.$store.state.activeTrip.polyline[sectionIdx][i - 1][1],
              "M"
            )
            if (currentDistance >= searchLength) {
              offset = i
              break
            }
          }
        } else {
          sectionIdx = this.searchStop
          // console.log(this.$store.state.activeTrip.polyline)
          for (let i = 0; i < this.$store.state.activeTrip.polyline[sectionIdx].length - 1; i++) {
            currentDistance += this.distance(
              this.$store.state.activeTrip.polyline[sectionIdx][i][0],
              this.$store.state.activeTrip.polyline[sectionIdx][i][1],
              this.$store.state.activeTrip.polyline[sectionIdx][i + 1][0],
              this.$store.state.activeTrip.polyline[sectionIdx][i + 1][1],
              "M"
            )
            if (currentDistance >= searchLength) {
              offset = i
              break
            }
          }
        }

        if (offset > -1) {
          var span = 0.2

          var lat = this.$store.state.activeTrip.polyline[sectionIdx][offset][0]
          var lon = this.$store.state.activeTrip.polyline[sectionIdx][offset][1]
          let remainingPolyline = []
          for (let i = offset; i < this.$store.state.activeTrip.polyline[sectionIdx].length; i++) {
            remainingPolyline.push(this.$store.state.activeTrip.polyline[sectionIdx][i])
          }
          this.$store.commit("setAlongRoutePolyline", remainingPolyline)
          // console.log("Lat: " + lat + " Lon: " + lon)
          this.$store.commit("setNewMapRegion", {
            centerLat: lat,
            centerLon: lon,
            diffLat: span,
            diffLon: span,
          })
          this.$store.commit("setSearchPredefined", "None")
          setTimeout(() => {
            window.mymapview.searchAlongTripActive = true
            this.$store.commit("setSearchPredefined", this.searchTerm)
          }, 1000)
        } else {
          console.log("no location found")
        }
      } else {
        var lat1 = this.$store.state.activeTrip.stops[this.searchStop].coordinate.latitude
        var lon1 = this.$store.state.activeTrip.stops[this.searchStop].coordinate.longitude
        var span1 = parseFloat(this.searchDistance) / 100.0
        this.$store.commit("setNewMapRegion", {
          centerLat: lat1,
          centerLon: lon1,
          diffLat: span1,
          diffLon: span1,
        })
        this.$store.commit("setSearchPredefined", "None")
        setTimeout(() => {
          this.$store.commit("setSearchPredefined", this.searchTerm)
        }, 1000)
      }
    },
    deg2rad(deg) {
      return (deg * 3.14159265359) / 180
    },
    rad2deg(rad) {
      return (rad * 180.0) / 3.14159265359
    },
    distance(lat1, lon1, lat2, lon2, unit) {
      let theta = lon1 - lon2
      var dist =
        Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(theta))
      dist = Math.acos(dist)
      dist = this.rad2deg(dist)
      dist = dist * 60.0 * 1.1515
      if (unit == "K") {
        dist = dist * 1.609344
      } else if (unit == "N") {
        dist = dist * 0.8684
      } else if (unit == "M") {
        dist = dist * 1.609344 * 1000.0
      }
      return dist
    },
  },
}
</script>
<style scoped>
div {
  font-size: 0.6rem;
}
button {
  font-size: 0.6rem;
  margin-right: 0.1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}
.search-along-route-banner {
  /* z-index: 450; */
  font-size: 0.6rem;
  /* position: absolute; */
  position: relative;
  /* top: 2rem; */
  display: flex;
  margin-left: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border: solid rgb(80, 80, 80) 1px;
  border-radius: 0.25rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  margin-right: 0.1rem;
  margin-left: 0.1rem;
}
.search-along-route-banner > div:nth-child(1) {
  font-weight: bolder;
}
.dropdown-icon {
  position: absolute;
  top: 0rem;
  right: 0.2rem;
}
.shift-left {
  left: 15.5rem;
}
.shift-right {
  left: 32rem;
}
.search-along-route-banner img {
  height: 0.45rem;
  padding-top: 0.25rem;
  padding-left: 0.1rem;
}
select {
  font-size: 0.5rem;
}
</style>
