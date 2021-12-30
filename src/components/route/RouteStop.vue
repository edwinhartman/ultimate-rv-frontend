<template>

  <div class="route-stop" :alt="stop.name">
      <img class="icon clickable" src="/static/red-circle-x.png" alt="Remove" @click="deleteStop({ route }, { stop })">
    <div class="stop-name">{{ stopName }}</div>
    <button
      v-if="stop._id == route.stops[0]._id && !route.firstStopIsDeparture"
      @click="setAsOrigin({ route })"
    >
      Origin
    </button>
    <img
      v-if="stop._id == route.stops[0]._id && route.firstStopIsDeparture"
      src="/static/origin-icon.png"
      class="icon clickable"
      alt="Origin Location"
      @click="removeAsOrigin({ route })"
    />
    <img class="icon clickable" src="/static/zoom-icon.png" @click="zoomToRegion()">
    <div v-if="stopIdx != route.stops.length-1" class="calendar-icon clickable" @click="setDate({route},{stop})">
    <img class="icon mr-1" src="/static/calendar-icon.png" alt="Calendar" >
    <div v-if="route.dates.length > stopIdx && route.dates[stopIdx] != null && route.dates[stopIdx] != ''">{{getDay(route.dates[stopIdx])}}</div>
    </div>
  </div>

</template>
<script>
export default {
  name: "RouteStop",
  props: {
    stop_prop: {
      type: Object,
      required: true,
    },
    route_prop:{
        type:Object,
        required:true
    }
  },
  data() {
    return {
      stop: this.stop_prop,
      route:this.route_prop
    };
  },
  computed:{
    stopName(){
      // if (this.element.name.length > 25){
      //   return this.element.name.substr(0,25)
      // }
      return this.stop.name
    },
    stopIdx(){
      let idx = -1
      for (let i=0;i<this.route.stops.length;i++){
        if (this.stop._id === this.route.stops[i]._id){
          idx = i
          break
        }
      }
      return idx
    }
  },
  watch:{
    route_prop:function(){
      this.route = this.route_prop
    }
  },
  methods:{
    deleteStop(route_info, stop_info) {
      this.$store.dispatch("removeStopFromRoute", {
        route_id: route_info.route._id,
        stop_id: stop_info.stop._id,
      });
    },
    setAsOrigin(route) {
      this.$store.dispatch("setAsOrigin", { route: route, isOrigin: true });
    },
    removeAsOrigin(route) {
      this.$store.dispatch("setAsOrigin", { route: route, isOrigin: false });
    },
    zoomToRegion(){
      //console.log(this.element)
      this.$store.commit("setNewMapRegion",{centerLat:this.stop.coordinate.latitude,centerLon:this.stop.coordinate.longitude,diffLat:0.25,diffLon:0.25})
    },
    setDate(route_info, stop_info){
      this.$store.dispatch("editRouteStopDate",{
        route:route_info,
        stop:stop_info,
        stop_idx:this.stopIdx
      })
    },
    getDay(d){
      var date = d.substring(0,10).split('-')
      date = date[1] + "-" + date[2] + "-" + date[0]
      let d1 = new Date(date)
      return d1.getDate()
    }
  }
};
</script>
<style scoped>
div.route-stop {
    font-size:0.65rem;
    text-align: left;
    margin-left:0.2rem;
    display: flex;
    flex-direction: row;
}
div.route-stop img:first-child {
    margin-right:0.25rem;
}
div.stop-name{
  max-width:11rem;
}
div.calendar-icon{
  position: relative;
}
div.calendar-icon img {
  position:absolute;
  left:0;
  top:0;
}
div.calendar-icon div {
  position:absolute;
  left:0;
  top:0;
  color:red;
  font-weight: 900;
  margin-left:0;
  margin-top:0;
  font-size:0.75rem;
  background-color: rgba(255,255,255,0.7);
  width:0.85rem;
  text-align: center;
}
</style>