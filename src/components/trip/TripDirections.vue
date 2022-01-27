<template>
  <div class="overflow-scroll max-h-96 w-144 p-0 -mt-8 -mb-2 -mr-4 -ml-2" id="to_be_printed">
    <Tabs v-model="active">
      <Tab title="Main Trip">
        <button class="printbutton" @click="print">Print</button>
        <div
          v-if="
            $store.state.activeTrip != null &&
            $store.state.activeTrip.actions != null &&
            $store.state.activeTrip.actions.length > 0
          "
          class="tabwindow text-left"
        >
          <div
            v-for="(section, idx) in $store.state.activeTrip.actions"
            :key="section._id"
            class="tripinstructions_section"
          >
            <div class="text-tiny font-bold italic">
              {{ $store.state.activeTrip.stops[idx].name }} to {{ $store.state.activeTrip.stops[idx + 1].name }} [{{
                ($store.state.activeTrip.summary[idx].length / 1600).toFixed(0)
              }}
              miles]
            </div>
            <div v-for="action in section" :key="action._id" class="text-tiny">
              <div v-if="action.severity != null || action.action == 'arrive' || action.action == 'depart'">
                {{ action.instruction }}
              </div>
            </div>
          </div>
        </div>
      </Tab>
      <Tab title="Day Trips" v-if="daytrips.length > 0">
        <div class="tabwindow">
          <div v-for="daytrip in daytrips" :key="daytrip.id">
            <div v-for="section in daytrip[0].sections" :key="section.id" class="tripinstructions_section">
              <div v-for="action in section.actions" :key="action.id">
                {{ action.instruction }}
              </div>
            </div>
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import Tabs from "../common/Tabs.vue"
import Tab from "../common/Tab.vue"
import { ref } from "@vue/reactivity"

export default {
  name: "TripDirections",
  setup() {
    const active = ref(0)

    return { active }
  },
  components: {
    Tabs,
    Tab,
  },
  computed: {
    daytrips() {
      if (
        this.$store.state.activeTrip.daytrips != null &&
        this.$store.state.activeTrip.daytrips.length > 0 &&
        this.$store.state.activeTrip.daytrips[0].routes.length > 0
      ) {
        let arr = this.$store.state.activeTrip.daytrips[0].routes.filter((r) => r.length > 0)
        if (arr.length > 0) {
          return arr
        } else {
          return []
        }
      } else {
        return []
      }
    },
  },
  methods: {
    print() {
      const options = {
        name: "_blank",
        specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
        styles: ["./static/css/print_style.css"],
        windowTitle: "Trip - " + this.$store.state.activeTrip.name,
      }
      //   console.log(options)
      this.$htmlToPaper("to_be_printed", options)
    },
  },
}
</script>
<style scoped>
div.tabwindow {
  min-width: 50rem;
  min-height: 50rem;
  overflow-y: scroll;
  max-height: 50rem;
  text-align: left;
}
button.printbutton {
  position: absolute;
  right: 0.5rem;
}
</style>
