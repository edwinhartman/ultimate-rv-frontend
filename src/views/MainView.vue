<template>
  <div class="main_div">
    <ModalPopup
      v-if="$store.state.showOpenExistingTrip"
      :rightTopCloseOption="true"
      @close="$store.commit('setShowOpenExistingTrip', !$store.state.showOpenExistingTrip)"
    >
      <TripOpenDialog />
    </ModalPopup>
    <ModalPopup
      v-if="$store.state.showTripDirections"
      :rightTopCloseOption="true"
      @close="$store.commit('setShowTripDirections', !$store.state.showTripDirections)"
      dialogTitle=""
    >
      <TripDirections />
    </ModalPopup>
    <ModalPopup
      v-if="$store.state.showAbout"
      :rightTopCloseOption="true"
      @close="$store.commit('setShowAbout', !$store.state.showAbout)"
    >
      <AboutPage />
    </ModalPopup>
    <ModalPopup
      v-if="$store.state.showTripTolls"
      :rightTopCloseOption="true"
      @close="$store.commit('setShowTripTolls', !$store.state.showTripTolls)"
    >
      <TripTolls />
    </ModalPopup>
    <ModalPopup v-if="$store.state.routeCalculateInProcess">
      <div>Trip Calculation In Process. Please Wait</div>
    </ModalPopup>
    <ModalPopup
      v-if="$store.state.showPicture != null"
      :rightTopCloseOption="true"
      @close="$store.commit('clearShowPicture')"
    >
      <div>{{ $store.state.showPicture.title }}</div>
      <img :src="$store.state.showPicture.url" />
    </ModalPopup>
    <ModalPopup v-if="$store.state.accountMaintenanceActive">
      <AccountMain />
    </ModalPopup>
    <ModalPopup v-if="$store.state.editStopDateActive">
      <EditTripStopDate />
    </ModalPopup>
    <ModalPopup v-if="$store.state.presentAlternativeData != null">
      <AddAlternativeToStop />
    </ModalPopup>
    <Header />
    <div class="main_window">
      <LeftToolbar />
      <MapView class="z-0" id="main_map_view_123" :map_width="map_width" :map_height="map_height" />
      <RightToolbar />
    </div>
  </div>
</template>
<script>
import Header from "../components/toolbars/Header.vue"
import LeftToolbar from "../components/toolbars/LeftToolbar.vue"
import MapView from "../components/map/MapView.vue"
import RightToolbar from "../components/toolbars/RightToolbar.vue"
import ModalPopup from "../components/templates/ModalPopup.vue"
import TripDirections from "../components/trip/TripDirections.vue"
import AboutPage from "../components/other/AboutPage.vue"
import TripTolls from "../components/trip/TripTolls.vue"
import AccountMain from "../components/account/AccountMain.vue"
import EditTripStopDate from "../components/trip/EditTripStopDate.vue"
import AddAlternativeToStop from "../components/trip/AddAlternativeToStop.vue"
import TripOpenDialog from "../components/trip/TripOpenDialog"

export default {
  name: "MainView",
  components: {
    Header,
    LeftToolbar,
    MapView,
    RightToolbar,
    ModalPopup,
    TripDirections,
    AboutPage,
    TripTolls,
    AccountMain,
    EditTripStopDate,
    AddAlternativeToStop,
    TripOpenDialog,
  },
  data() {
    return {
      map_width: 800,
      map_height: 600,
    }
  },
  mounted() {
    var w = window.innerWidth
    var h = window.innerHeight
    this.map_width = w - 435
    this.map_height = h - 33
    document.getElementById("main_map_view_123").style.width = w - 435 + "px"
    document.getElementById("main_map_view_123").style.height = h + "px"
  },
  created() {
    window.addEventListener("resize", this.handleResize)
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize)
  },
  methods: {
    handleResize(e) {
      var w = window.innerWidth
      var h = window.innerHeight
      this.map_width = w - 445
      this.map_height = h - 33
      document.getElementById("main_map_view_123").style.width = w - 445 + "px"
      document.getElementById("main_map_view_123").style.height = h + "px"
    },
  },
}
</script>
<style scoped>
div.main_div {
  background: rgba(255, 255, 255, 0.8);
}
</style>
