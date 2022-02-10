<template>
  <div class="secondary-color right-toolbar shadow-left" :class="!hideToolbar ? 'active' : ''">
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
    <div class="hide-show-toolbar" @click="showHideRightToolbar">||</div>
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
      hideToolbar: false,
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
    showHideRightToolbar() {
      this.hideToolbar = !this.hideToolbar
      this.$store.commit("toolbars/setShowRightToolbar", !this.hideToolbar)
    },
  },
}
</script>
<style scoped>
div.right-toolbar {
  /* max-width: 16rem;
  min-width: 12.5rem; */

  z-index: 80;
  height: var(--main-height);
  overflow: hidden;
  background-color: var(--main-bg-color);
  position: relative;
  width: 0.8rem;
  transition: width 0.5s ease-in-out;
}
div.right-toolbar * {
  display: none;
}
div.right-toolbar.active {
  width: var(--side-toolbar-width);
}
div.right-toolbar.active *:not(:last-child) {
  display: inline-block;
}
div.hide-show-toolbar {
  position: absolute;
  top: 49vh;
  left: -1px;
  height: 2rem;
  width: 0.5rem;
  border: 1px solid rgba(172, 172, 172, 0.6);
  border-radius: 0 0.5rem 0.5rem 0;
  display: flex;
  align-items: center;
  background-color: rgb(225, 223, 238);
  cursor: pointer;
}
</style>
