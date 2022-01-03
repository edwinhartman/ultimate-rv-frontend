<template>
  <div
    v-if="
      $store.state.activeRoute != null &&
      $store.state.activeRoute.polyline != null &&
      $store.state.activeRoute.polyline.length > 0
    "
  >
  <div class="search-along-route-banner">
    <div @click="expanded = !expanded">Search Along Route</div>
      <img v-if="!expanded"
      @click="expanded = true" src="/static/arrow-down-icon.png" class="icon clickable" />

    
      <img v-if="expanded"
      @click="expanded = false" src="/static/arrow-up-icon.png" class="icon clickable" />
  </div>
    <div v-if="expanded">
      <select name="" id="" v-model="searchTerm">
        <option
          v-for="opt in predefinedSearchTypes"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.display }}
        </option>
      </select>
      <br />
      <select
        name=""
        id=""
        v-model="searchDistance"
      >
        <option value="15">15 Miles</option>
        <option value="30">30 Miles</option>
        <option value="50">50 Miles</option>
        <option value="75" v-if="searchBeforeAfterAround != 'around'">
          75 Miles
        </option>
        <option value="100" v-if="searchBeforeAfterAround != 'around'">
          100 Miles
        </option>
        <option value="150" v-if="searchBeforeAfterAround != 'around'">
          150 Miles
        </option>
        <option value="200" v-if="searchBeforeAfterAround != 'around'">
          200 Miles
        </option>
        <option value="250" v-if="searchBeforeAfterAround != 'around'">
          250 Miles
        </option>
        <option value="300" v-if="searchBeforeAfterAround != 'around'">
          300 Miles
        </option>
        <option value="350" v-if="searchBeforeAfterAround != 'around'">
          350 Miles
        </option>
        <option value="400" v-if="searchBeforeAfterAround != 'around'">
          400 Miles
        </option>
        <option value="450" v-if="searchBeforeAfterAround != 'around'">
          450 Miles
        </option>
        <option value="500" v-if="searchBeforeAfterAround != 'around'">
          500 Miles
        </option>
      </select>
      <select
        name=""
        id=""
        v-model="searchBeforeAfterAround"
      >
        <option value="around">Around</option>
        <option value="before" v-if="searchStop != null && searchStop > 0">
          Before
        </option>
        <option
          value="after"
          v-if="
            searchStop != null &&
            searchStop < $store.state.activeRoute.stops.length - 1
          "
        >
          After
        </option>
      </select>
      <br />
      <select name="" id="" v-model="searchStop">
        <option
          v-for="(stop, idx) in $store.state.activeRoute.stops"
          :key="stop._id"
          :value="idx"
        >
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
          @click="searchAlongRoute()"
          :disabled="searchEnabled == false"
        >
          Go
        </button>
        <button
          @click="clearSearch()"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { getPredefinedSearchTypes } from "../../definitions/PredefinedSearchTypes.js";

export default {
  name: "SearchAlongRoute",
  computed: {
    searchEnabled() {
      if (
        this.searchTerm != "" &&
        this.searchDistance != 0 &&
        this.searchStop != null
      ) {
        return true;
      }
      return false;
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
    };
  },
  created() {
    this.predefinedSearchTypes = getPredefinedSearchTypes();
  },
  methods: {
    trimStopName(stopName) {
      if (stopName.length > 30) {
        return stopName.substr(0, 27) + "...";
      }
      return stopName;
    },
    clearSearch() {
      this.searchTerm = "";
      this.searchDistance = 0;
      this.searchStop = null;
      this.searchBeforeAfterAround = "";
      this.$store.commit("setSearchPredefined", "None");
    },
    searchAlongRoute() {
      if (
        this.searchBeforeAfterAround == "after" ||
        this.searchBeforeAfterAround == "before"
      ) {
        let sectionIdx = -1;
        let searchLength = this.searchDistance * 1600;
        var currentDistance = 0;
        let offset = -1;

        if (this.searchBeforeAfterAround == "before") {
          sectionIdx = this.searchStop - 1;
          for (let i = this.$store.state.activeRoute.polyline[sectionIdx].length - 1;i > 0;i--) {
            currentDistance += this.distance(
              this.$store.state.activeRoute.polyline[sectionIdx][i][0],
              this.$store.state.activeRoute.polyline[sectionIdx][i][1],
              this.$store.state.activeRoute.polyline[sectionIdx][i - 1][0],
              this.$store.state.activeRoute.polyline[sectionIdx][i - 1][1],
              "M"
            );
            if (currentDistance >= searchLength) {
              offset = i;
              break;
            }
          }
        } else {
          sectionIdx = this.searchStop;
          for (let i = 0;i < this.$store.state.activeRoute.polyline[sectionIdx].length - 1;i++) {
            currentDistance += this.distance(
              this.$store.state.activeRoute.polyline[sectionIdx][i][0],
              this.$store.state.activeRoute.polyline[sectionIdx][i][1],
              this.$store.state.activeRoute.polyline[sectionIdx][i + 1][0],
              this.$store.state.activeRoute.polyline[sectionIdx][i + 1][1],
              "M"
            );
            if (currentDistance >= searchLength) {
              offset = i;
              break;
            }
          }
        }

        if (offset > -1) {
          var span = 0.5;

          var lat =
            this.$store.state.activeRoute.polyline[sectionIdx][offset][0];
          var lon =
            this.$store.state.activeRoute.polyline[sectionIdx][offset][1];
          this.$store.commit("setNewMapRegion", {
            centerLat: lat,
            centerLon: lon,
            diffLat: span,
            diffLon: span,
          });
          this.$store.commit("setSearchPredefined", "None");
          setTimeout(() => {
            this.$store.commit("setSearchPredefined", this.searchTerm);
          }, 1000);
        } else {
          console.log("no location found");
        }
      } else {
        var lat1 =
          this.$store.state.activeRoute.stops[this.searchStop].coordinate
            .latitude;
        var lon1 =
          this.$store.state.activeRoute.stops[this.searchStop].coordinate
            .longitude;
        var span1 = parseFloat(this.searchDistance) / 100.0;
        this.$store.commit("setNewMapRegion", {
          centerLat: lat1,
          centerLon: lon1,
          diffLat: span1,
          diffLon: span1,
        });
        this.$store.commit("setSearchPredefined", "None");
        setTimeout(() => {
          this.$store.commit("setSearchPredefined", this.searchTerm);
        }, 1000);
      }
    },
    deg2rad(deg) {
      return (deg * 3.14159265359) / 180;
    },
    rad2deg(rad) {
      return (rad * 180.0) / 3.14159265359;
    },
    distance(lat1, lon1, lat2, lon2, unit) {
      let theta = lon1 - lon2;
      var dist =
        Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.cos(this.deg2rad(theta));
      dist = Math.acos(dist);
      dist = this.rad2deg(dist);
      dist = dist * 60.0 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      } else if (unit == "N") {
        dist = dist * 0.8684;
      } else if (unit == "M") {
        dist = dist * 1.609344 * 1000.0;
      }
      return dist;
    },
  },
};
</script>
<style scoped>
div {
  font-size:0.7rem;
}
button{
  font-size:0.6rem;
  margin-right: 0.1rem;
  margin-top:0.1rem;
  margin-bottom:0.1rem;
}
.search-along-route-banner{
  display: flex;
  margin-left:0.2rem;
}
.search-along-route-banner img {
  height: 0.45rem;
  padding-top:0.25rem;
  padding-left:0.1rem;
}
select{
  font-size:0.5rem;
}
</style>