<template>
  <div class="general-settings relative">
    <div class="w-full">
      <div class="font-bold clickable" @click="expanded = !expanded">General Settings</div>
      <div v-if="!expanded" @click="expanded = true" class="min-max-button clickable">
        <img src="/static/arrow-down-icon.png" class="icon" />
      </div>
    </div>

    <transition name="fade">
      <div v-if="expanded" @click="expanded = false" class="min-max-button">
        <img v-if="expanded" src="/static/arrow-up-icon.png" class="icon" />
      </div>
    </transition>
    <transition name="fade-fast">
      <div v-if="expanded" class="text-left w-full">
        <ul class="list-none mb-1">
          <li>
            <input type="checkbox" id="PreventToll" value="true" v-model="preventTollroads" />
            <label for="PreventToll">Prevent Tollroads</label>
          </li>
          <li>
            <input type="checkbox" id="AlwaysShowTripSummary" value="true" v-model="alwaysShowTripSummary" />
            <label for="AlwaysShowTripSummary">Always Show Trip Summary</label>
          </li>
          <li>
            <input type="checkbox" id="ShowYelpDetails" value="true" v-model="showYelpDetails" />
            <label for="ShowYelpDetails">Show Yelp Details</label>
          </li>
          <li>
            <input type="checkbox" id="ShowRVSettings" value="true" v-model="showRVSettings" />
            <label for="ShowRVSettings">Show RV Settings Section</label>
          </li>
          <li>
            <Popper :interactive="false" :hover="true">
              <div>
                <input type="checkbox" id="AutoPreventBigCities" value="true" v-model="autoPreventBigCities" />
                <label for="AutoPreventBigCities">Automatically Prevent Big Cities</label>
              </div>
              <template #content>
                <div class="tooltip-popup2">
                  This will automatically bring in areas to avoid surrounding major cities when creating a new route
                </div>
              </template>
            </Popper>
          </li>
          <li>
            <input type="checkbox" id="ShowArchivedTrips" value="true" v-model="showArchivedTrips" />
            <label for="ShowArchivedTrips">Show Archived Trips section</label>
          </li>
          <li v-if="$store.state.adminToken != null">
            <input type="checkbox" id="HideAdminFunctions" value="true" v-model="hideAdminFunctions" />
            <label for="HideAdminFunctions">Hide Admin Functions</label>
          </li>
          <li v-if="$store.state.adminToken != null && !$store.state.settings.hideAdminFunctions">
            <input type="checkbox" id="ShowSystemTrips" value="true" v-model="showSystemTrips" />
            <label for="ShowSystemTrips">Show System Trips section</label>
          </li>
          <li>
            Default Origin:
            <select name="" id="" v-model="defaultOriginType">
              <option value="current">Current Location</option>
              <option value="home">Home Location</option>
            </select>
          </li>
          <li v-if="defaultOriginType == 'home'">Home Address: <input type="text" /></li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import Popper from "vue3-popper"
export default {
  name: "GeneralSettings",
  components: {
    Popper,
  },
  data() {
    return {
      preventTollroads: false,
      alwaysShowTripSummary: false,
      expanded: false,
      showYelpDetails: false,
      defaultOriginType: "current",
      autoPreventBigCities: false,
      showArchivedTrips: false,
      showSystemTrips: false,
      hideAdminFunctions: false,
      showRVSettings: false,
    }
  },
  mounted() {
    this.preventTollroads = this.$store.state.settings.preventTollroads
    this.alwaysShowTripSummary = this.$store.state.settings.alwaysShowTripSummary
    this.showYelpDetails = this.$store.state.settings.showYelpDetails
    this.defaultOriginType = this.$store.state.settings.defaultOriginType
    this.autoPreventBigCities = this.$store.state.settings.autoPreventBigCities
    this.showArchivedTrips = this.$store.state.settings.showArchivedTrips
    this.showSystemTrips = this.$store.state.settings.showSystemTrips
    this.hideAdminFunctions = this.$store.state.settings.hideAdminFunctions
    this.showRVSettings = this.$store.state.settings.showRVSettings
  },
  watch: {
    preventTollroads: function (newValue, oldValue) {
      this.$store.commit("settings/setPreventTollroads", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    "$store.state.settings.preventTollroads": function () {
      this.preventTollroads = this.$store.state.settings.preventTollroads
    },
    alwaysShowTripSummary: function (newValue, oldValue) {
      this.$store.commit("settings/setAlwaysShowTripSummary", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    showYelpDetails: function (newValue, oldValue) {
      this.$store.commit("settings/setShowYelpDetails", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    defaultOriginType: function (newValue, oldValue) {
      this.$store.commit("settings/setDefaultOriginType", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    autoPreventBigCities: function (newValue, oldValue) {
      this.$store.commit("settings/setAutoPreventBigCities", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    showArchivedTrips: function (newValue, oldValue) {
      this.$store.commit("settings/setShowArchivedTrips", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    showSystemTrips: function (newValue, oldValue) {
      this.$store.commit("settings/setShowSystemTrips", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    hideAdminFunctions: function (newValue, oldValue) {
      this.$store.commit("settings/setHideAdminFunctions", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
    showRVSettings: function (newValue, oldValue) {
      this.$store.commit("settings/setShowRVSettings", newValue)
      if (newValue != oldValue) {
        this.$store.dispatch("saveUserSettings")
      }
    },
  },
}
</script>
<style scoped>
.general-settings {
  width: 97%;
  font-size: 0.75rem;
  border: solid rgb(80, 80, 80) 1px;
  border-radius: 0.25rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  margin-bottom: 0.1rem;
  text-align: left;
  padding-left: 0.1rem;
  padding-bottom: 0.1rem;
}
select,
input {
  font-size: 0.65rem;
}
</style>
