<template>
  <div>
    <draggable
      v-model="route.stops"
      item-key="_id"
      @change="updateStopList(route)"
    >
      <template #item="{ element }">
        <TripStop :stop_prop="element" :route_prop="route" />
      </template>
    </draggable>
   
  </div>
</template>
<script>

import draggable from "vuedraggable";
import TripStop from "./TripStop.vue";

export default {
  name: "TripStops",
  components: {
    draggable,
    TripStop,
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