<template>
  <div
    v-if="summaries != null && summaries.length > 0"
    class="route-summary"
  >
    <div class="font-bold">
      <div class="clickable" @click="$store.commit('setShowRouteSummary',!$store.state.showRouteSummary)">Route Summary</div>
      <img class="icon clickable show-detailed-route-summary" src="/static/route_directions.png" @click="showRouteDirections()"></div>
      <div v-if="$store.state.alwaysShowRouteSummary || $store.state.showRouteSummary">
    <div>
      {{ $store.state.activeRoute.name }}
    </div>
    <div
      v-for="(summary, index) in summaries"
      :key="summary"
      class="summary"
    >
      <div>From {{$store.state.activeRoute.stops[index].name}} To {{$store.state.activeRoute.stops[index+1].name}}</div>
      <div class="distance-duration">
      <div>Distance:
      <div class="font-bold">{{ (summary.length / 1600).toFixed(0) }}</div> Mls <div>Estimated Time: <div class="font-bold">{{
        calculateHours(summary.duration)
      }}</div>
      Hrs</div></div>
      <img v-if="$store.state.activeRoute.tolls != null && $store.state.activeRoute.tolls[index].length > 0" class="icon icon2 clickable" @click="showTolls()" src="/static/tollroad-icon.png">
    </div>
    </div>
    <div class="font-bold">Total: {{ getTotalDistance() }} miles</div>
      </div>
  </div>
</template>
<script>
export default {
  name: "RouteSummary",
  data(){
      return {
          summaries:[]
      }
  },
  mounted(){
    this.summaries = this.$store.state.summaries
  },
  watch: {
    "$store.state.summaries":function(){
      this.summaries = this.$store.state.summaries
    }
  },
  methods: {
    getTotalDistance() {
      if (this.$store.state.summaries != null) {
        if (this.$store.state.summaries.length == 0) {
          return 0;
        } else {
          let total = 0;
          for (let i = 0; i < this.$store.state.summaries.length; i++) {
            total += this.$store.state.summaries[i].length;
          }
          return (total / 1600).toFixed(0);
        }
      }
    },
    calculateHours(seconds) {
      let minutes = seconds / 60;
      let hrs = Math.floor(minutes / 60);
      let minutes_rounded = (minutes - Number(hrs) * 60).toFixed(0);
      if (minutes_rounded.length < 2) {
        minutes_rounded = "0" + minutes_rounded;
      }
      return hrs + ":" + minutes_rounded;
    },
    showRouteDirections(){
      this.$store.commit('setShowRouteDirections',!this.$store.state.showRouteDirections)
    },
    showTolls(){
      this.$store.commit('setShowRouteTolls',!this.$store.state.showRouteTolls)
    }
  },
};
</script>
<style scoped>
.route-summary{
  bottom:1.25rem;
  left:0;
  font-size:0.6rem;
  width: 98%;
  z-index: 1000;
  position: absolute;
  border:solid rgb(80,80,80) 1px;
  border-radius: 0.25rem;
  margin-top:0.1rem;
  margin-bottom:0.1rem;
  margin-right:0.1rem;
  margin-left:0.1rem;
}
img.show-detailed-route-summary{
  position: absolute;
  top:0.1rem;
  right:0.1rem;
}
.summary{
  text-align: left;
  margin-left:0.2rem;
  margin-right:0.2rem;
}
.summary div{
  display: inline;
}
div.distance-duration{
  width:100%;
  display: block;
  font-size:0.5rem;
}
img.icon2{
  position:absolute;
  height:0.6rem;
  width:0.6rem;
}
</style>