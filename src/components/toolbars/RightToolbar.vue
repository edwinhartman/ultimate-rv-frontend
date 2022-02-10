<template>
  <div class="secondary-color right-toolbar shadow-left">
    <SearchPredefined />
    <GeneralSettings />
    <RVListing
      v-if="$store.state.rvs.length > 0 && $store.state.settings.showRVSettings"
      @add_new="openRVEditPanel"
      @edit_active_rv="editActiveRV"
      :edit_active="addNewRV || editRV != null"
    />
    <RVSettings v-if="$store.state.rvs.length == 0 || addNewRV" @close_panel="closeRVEditPanel" :edit_rv="editRV" />
    <AnnotationDetails v-if="$store.state.showAnnotationDetails" />
    <SharedSearchMarkerListing />
  </div>
</template>
<script>
import RVSettings from "../rv/RVSettings.vue"
import RVListing from "../rv/RVListing.vue"
import SearchPredefined from "../search/SearchPredefined.vue"
import GeneralSettings from "../other/GeneralSettings.vue"
import SharedSearchMarkerListing from "../search/SharedSearchMarkerListing.vue"
import AnnotationDetails from "../search/AnnotationDetails.vue"

export default {
  name: "RightToolbar",
  data() {
    return {
      addNewRV: false,
      editRV: null,
    }
  },
  components: {
    RVSettings,
    RVListing,
    SearchPredefined,
    GeneralSettings,
    SharedSearchMarkerListing,
    AnnotationDetails,
  },
  created() {
    this.$store.dispatch("loadRVs")
  },
  methods: {
    editActiveRV() {
      this.addNewRV = true
      this.editRV = this.$store.state.activeRV
    },
    closeRVEditPanel() {
      this.addNewRV = false
      this.editRV = null
    },
    openRVEditPanel() {
      this.addNewRV = true
    },
  },
}
</script>
<style scoped>
div.right-toolbar {
  max-width: 16rem;
  min-width: 12.5rem;
  z-index: 80;
  height: var(--main-height);
  overflow: hidden;
  background-color: var(--main-bg-color);
}
</style>
