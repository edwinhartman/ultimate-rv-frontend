<template>
  <div class="text-left pl-2">
    <RouteOverview
      v-for="route in activeRoutes"
      :key="route._id"
      :route_prop="route"
    />
      
    <div v-if="archivedRoutes.length > 0 && $store.state.showArchivedRoutes" class="archived-routes-div">
      <div class="font-bold relative">Archived Routes <img v-if="!showArchivedRoutes" src="/static/arrow-down-icon.png" class="icon min-max-button2 clickable" @click="toggleShowArchivedRoutes()"><img v-if="showArchivedRoutes" src="/static/arrow-up-icon.png" class="icon min-max-button2 clickable" @click="toggleShowArchivedRoutes()"></div>
      <div v-if="showArchivedRoutes">
    <ArchivedRoutes v-for="route in archivedRoutes" :key="route._id" :route_prop="route" />
      </div>
    </div>
    <div v-if="adminToken != null && $store.state.showSystemRoutes && !$store.state.hideAdminFunctions" class="system-routes-div">
      <div class="font-bold relative">System Routes <img v-if="!showSystemRoutes" src="/static/arrow-down-icon.png" class="icon min-max-button2 clickable" @click="toggleShowSystemRoutes()"><img v-if="showSystemRoutes" src="/static/arrow-up-icon.png" class="icon min-max-button2 clickable" @click="toggleShowSystemRoutes()"></div>
      <div v-if="showSystemRoutes">
      <RouteOverview v-for="route in systemRoutes" :key="route._id" :route_prop="route" />
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
      showArchivedRoutes:false,
      showSystemRoutes:false,
      adminToken:this.$store.state.adminToken
    };
  },
  computed:{
    activeRoutes(){
      return this.routes.filter(r => (r.archived == null || !r.archived) && !r.system )
    },
    archivedRoutes(){
      return this.routes.filter(r => (r.archived != null && r.archived) && !r.system )
    },
    systemRoutes(){
      return this.routes.filter(r => r.system )

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
    },
    toggleShowSystemRoutes(){
      this.showSystemRoutes = !this.showSystemRoutes
    }
  }
};
</script>
<style scoped>
.archived-routes-div,.system-routes-div{
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