<template>
  <div class="secondary-color left-toolbar shadow-right">
    <LocationSearch />
    <RouteListing />
    <RouteSummary  />
    <div class="toolbar-buttons">
    <div>
      <Popper :interactive="false" :hover="true">
      <button @click="addNewRoute">Add New Route</button>
      <template #content>
        <div class="tooltip-popup">This will create a new blank route</div>
      </template>
      </Popper>
    </div>
    <div>
      <Popper :interactive="false" :hover="true">
      <button @click="copyToReverse">Copy  To Reverse</button>
      <template #content>
        <div class="tooltip-popup">This will create a new route that is the reverse of the active route</div>
      </template>
      </Popper>
    </div>
    </div>
  </div>
</template>
<script>
import LocationSearch from '../search/LocationSearch.vue'
import RouteListing from '../route/RouteListing.vue'
import RouteSummary from "../route/RouteSummary.vue";
import Popper from 'vue3-popper'

export default {
  name: "LeftToolbar",
  components: {
    LocationSearch,
    RouteListing,
    RouteSummary,
    Popper
  },
  
  computed: {
    stopList: {
      get() {
        if (
          this.$store.state.activeRoute != null &&
          this.$store.state.activeRoute.stops != null
        ) {
          return this.$store.state.activeRoute.stops;
        }
        return null;
      },
      set(value) {
        this.$store.dispatch("updateStopList", value);
      },
    },
  },
  
  methods: {
    deleteStop(route_info, stop_info) {
      this.$store.dispatch("removeStopFromRoute", {
        route_id: route_info.route._id,
        stop_id: stop_info.element._id,
      });
    },
    
    addNewRoute() {
      this.$store.dispatch("addBlankRoute");
    },
    copyToReverse(){
      this.$store.dispatch("copyActiveRouteToReverse")
    }
  },
  created() {
    this.$axios
      .get(process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getRoutes")
      .then((res) => {
        //this.menu_items=res.data.menu;
        if (res.data.routes.length == 0) {
          this.$axios({
            method: "post",
            url:
              process.env.VUE_APP_BACKEND_CONNECTION_URI +
              "/createDefaultRoute",
          })
            .then((res) => {
              this.$store.commit("resetValues");
              this.$store.commit("loadRoutes", res.data.routes);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$store.commit("loadRoutes", res.data.routes);
        }
      })
      .catch((error) => console.log(error));
  },
};
</script>
<style scoped>
div.left-toolbar{
  min-width:12rem;
  max-width: 16rem;
  padding-left:0.1rem;
  padding-right:0.1rem;
  z-index:80;
  max-height: 97vh;
  overflow:hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
div.toolbar-buttons{
  width:15vw;
  display:flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left:0.1rem;
  position: absolute;
  bottom:0.2rem;
  min-width:12rem;
  max-width:15rem;
}
div.toolbar-buttons button{
  font-size: 0.6rem;
  margin-right:0.1rem;
  cursor: pointer;
}
</style>