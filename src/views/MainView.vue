<template>
  <div class="main_div">
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.dialogs.showOpenExistingTrip"
        :rightTopCloseOption="true"
        @close="$store.commit('dialogs/setShowOpenExistingTrip', !$store.state.dialogs.showOpenExistingTrip)"
      >
        <TripOpenDialog />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.dialogs.showTripDirections"
        :rightTopCloseOption="true"
        @close="$store.commit('dialogs/setShowTripDirections', !$store.state.dialogs.showTripDirections)"
        dialogTitle=""
      >
        <TripDirections />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.dialogs.showAbout"
        :rightTopCloseOption="true"
        @close="$store.commit('dialogs/setShowAbout', !$store.state.dialogs.showAbout)"
      >
        <AboutPage />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.settings.showTripTolls"
        :rightTopCloseOption="true"
        @close="$store.commit('dialogs/setShowTripTolls', !$store.state.dialogs.showTripTolls)"
      >
        <TripTolls />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup v-if="$store.state.dialogs.routeCalculateInProcess">
        <div>Trip Calculation In Process. Please Wait</div>
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.dialogs.showPicture != null"
        :rightTopCloseOption="true"
        @close="$store.commit('dialogs/clearShowPicture')"
      >
        <div>{{ $store.state.dialogs.showPicture.title }}</div>
        <img :src="$store.state.dialogs.showPicture.url" />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup v-if="$store.state.dialogs.accountMaintenanceActive">
        <AccountMain />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup v-if="$store.state.editStopDateActive">
        <EditTripStopDate />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup v-if="$store.state.dialogs.presentAlternativeData != null">
        <AddAlternativeToStop />
      </ModalPopup>
    </transition>
    <transition name="fade">
      <ModalPopup
        v-if="$store.state.dialogs.showTripCalendar"
        :rightTopCloseOption="true"
        :centerTitle="true"
        dialogTitle="Trip Calendar"
        @close="$store.commit('dialogs/setShowTripCalendar', !$store.state.dialogs.showTripCalendar)"
      >
        <CalendarView />
      </ModalPopup>
    </transition>

    <Header />
    <div class="main_window">
      <LeftToolbar />
      <MapView class="z-0" id="main_map_view_123" :map_width="map_width" :map_height="map_height" />
      <RightToolbar />
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "../components/toolbars/Header.vue"
import Footer from "../components/toolbars/Footer.vue"
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
import CalendarView from "./CalendarView.vue"

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
    CalendarView,
    Footer,
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
    this.map_height = document.documentElement.clientHeight * 0.94 // h - 55

    // console.log(getComputedStyle(document.documentElement).getPropertyValue("--main-height"))
    document.getElementById("main_map_view_123").style.width = w - 435 + "px"
    // document.getElementById("main_map_view_123").style.height = h + "px"
    document.getElementById("main_map_view_123").style.height = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--main-height")
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
      // this.map_height = h - 33
      this.map_height = document.documentElement.clientHeight * 0.94
      document.getElementById("main_map_view_123").style.width = w - 445 + "px"
      // document.getElementById("main_map_view_123").style.height = h + "px"
    },
  },
}
</script>
<style scoped>
div.main_div {
  background: rgba(255, 255, 255, 0.8);
}
</style>
