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
      <RightToolbar v-if="!this.isPhone() && !this.isTablet()" />
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
    this.setMapDimensions()
  },
  created() {
    window.addEventListener("resize", this.handleResize)
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize)
  },
  watch: {
    "$store.state.toolbars.showRightToolbar": function (newValue, oldValue) {
      console.log("showRightToolbar changed")
      this.setMapDimensions()
    },
  },
  methods: {
    setMapDimensions() {
      var w = window.innerWidth
      var h = window.innerHeight
      var sideToolbarWidth = this.convertRemToPixels(
        getComputedStyle(document.documentElement).getPropertyValue("--side-toolbar-width")
      )

      if (this.isPhone()) {
        this.map_width = w - this.convertRemToPixels("0.1rem")
      } else if (this.isTablet()) {
        this.map_width = w - sideToolbarWidth
      } else {
        this.map_width = w - (this.$store.state.toolbars.showRightToolbar ? 2 : 1) * sideToolbarWidth
      }
      this.map_height = document.documentElement.clientHeight * 0.94 // h - 55

      document.getElementById("main_map_view_123").style.width = this.map_width
      // document.getElementById("main_map_view_123").style.height = h + "px"
      document.getElementById("main_map_view_123").style.height = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--main-height")
    },
    handleResize(e) {
      this.setMapDimensions()
    },
  },
}
</script>
<style scoped>
div.main_div {
  background: rgba(255, 255, 255, 0.8);
}
</style>
