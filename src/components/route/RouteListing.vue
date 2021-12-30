<template>
  <div class="text-left pl-2">
    <RouteOverview
      v-for="route in activeRoutes"
      :key="route._id"
      :route_prop="route"
    />
      
    <div v-if="archivedRoutes.length > 0" class="archived-routes-div">
      <div class="font-bold relative">Archived Routes <img v-if="!showArchivedRoutes" src="/static/arrow-down-icon.png" class="icon min-max-button2 clickable" @click="toggleShowArchivedRoutes()"><img v-if="showArchivedRoutes" src="/static/arrow-up-icon.png" class="icon min-max-button2 clickable" @click="toggleShowArchivedRoutes()"></div>
      <div v-if="showArchivedRoutes">
    <ArchivedRoutes v-for="route in archivedRoutes" :key="route._id" :route_prop="route" />
      </div>
    </div>
    
  </div>
</template>
<script>
import RouteOverview from "./RouteOverview.vue";
import ArchivedRoutes from "./ArchivedRoutes.vue";

export default {
  name: "RouteListing",
  components: {
    RouteOverview,
    ArchivedRoutes
  },
  data() {
    return {
      routes: [],
      showArchivedRoutes:false
    };
  },
  computed:{
    activeRoutes(){
      return this.routes.filter(r => r.archived == null || !r.archived )
    },
    archivedRoutes(){
      return this.routes.filter(r => r.archived != null && r.archived )
    },
    expandCollapseValue(){
      if (this.showArchivedRoutes){
        return "[collapse]"
      }else{
        return "[expand]"
      }
    }
  },
  watch: {
    "$store.state.routes": function () {
      this.routes = this.$store.state.routes;
    },
  },
  methods:{
    toggleShowArchivedRoutes(){
      this.showArchivedRoutes = !this.showArchivedRoutes
    }
  }
};
</script>
<style scoped>
.archived-routes-div{
  font-size:0.7rem;
  margin-left:0.1rem;
  margin-top:0.2rem;
  border:solid rgb(80,80,80) 1px;
  border-radius: 0.25rem;
  padding-left:0.1rem;
  box-shadow: 0.1em 0.1em rgba(110, 110, 110,.5);
  padding-bottom:0.1rem;
}
</style>