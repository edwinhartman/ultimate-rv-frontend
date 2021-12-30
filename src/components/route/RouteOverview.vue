<template>
  <div class="route-overview">
    <RouteName :route_prop="route" />
    <RouteStops :route_prop="route" />
    <div v-if="route.active">
        <SearchAlongRoute :route_prop="route" />
    </div>
  </div>
</template>
<script>
import RouteName from "./RouteName.vue";
import RouteStops from "./RouteStops.vue";
import SearchAlongRoute from './SearchAlongRoute.vue'

export default{
    name:"RouteOverview",
    props:{
        route_prop:{
            type:Object,
            required:true
        }
    },
    components:{
        RouteName,
        RouteStops,
        SearchAlongRoute
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