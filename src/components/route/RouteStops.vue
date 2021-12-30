<template>
  <div>
    <draggable
      v-model="route.stops"
      item-key="_id"
      @change="updateStopList(route)"
    >
      <template #item="{ element }">
        <RouteStop :stop_prop="element" :route_prop="route" />
      </template>
    </draggable>
   
  </div>
</template>
<script>

import draggable from "vuedraggable";
import RouteStop from "./RouteStop.vue";

export default {
  name: "RouteStops",
  components: {
    draggable,
    RouteStop,
  },
  props: {
    route_prop: {
      type: Object,
      required: true,
    },
  },
  data(){
      return {
          route:this.route_prop
      }
  },
  watch:{
    route_prop:function(){
      this.route = this.route_prop
    }
  },
  methods: {
    updateStopList(route) {
      this.$store.dispatch("updateStopList", route);
    },
  },
};
</script>