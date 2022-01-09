<template>
  <div class="route-overview">
    <TripName :route_prop="route" />
    <TripStops :route_prop="route" />
    <!-- <div v-if="route.active">
        <SearchAlongTrip :route_prop="route" />
    </div> -->
  </div>
</template>
<script>
import TripName from "./TripName.vue";
import TripStops from "./TripStops.vue";
// import SearchAlongTrip from './SearchAlongTrip.vue'

export default{
    name:"TripOverview",
    props:{
        route_prop:{
            type:Object,
            required:true
        }
    },
    components:{
        TripName,
        TripStops,
        // SearchAlongTrip
    },
    data(){
        return{
            route:this.route_prop
        }
    },
    watch:{
        route_prop:function(){
            this.route = this.route_prop
        }
    },
}
</script>
<style scoped>
.route-overview{
    border:solid rgba(0,0,0,0.25) 1px;
    margin-bottom:0.1rem;
    border-radius: 0.25rem;
}
</style>