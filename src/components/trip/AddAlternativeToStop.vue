<template>
  <div>
    <div class="new_stop_name">{{ $store.state.dialogs.presentAlternativeData.new_stop.name }}</div>
    would be an alternative for which stops?
    <div v-for="stop in $store.state.dialogs.presentAlternativeData.nearby" :key="stop.stop._id" class="row">
      <input type="checkbox" name="" id="" v-model="selectedStops" :value="stop.stop._id" />
      <div class="old_stop" @click="addRemoveStop(stop.stop._id)">
        <div class="old_stop_name">
          {{ stop.stop.name }}
          <div v-if="stop.date != null" class="stop_date">Departure Date: {{ getDateFormatted(stop.date) }}</div>
        </div>
        <div class="old_address">{{ stop.stop.formattedAddress }}</div>
      </div>
    </div>
    <button @click="saveAlternatives" :disabled="selectedStops.length == 0">Set Alternative</button>
    <button @click="cancel">Cancel</button>
  </div>
</template>
<script>
export default {
  name: "AddAlternativeToStop",
  data() {
    return {
      selectedStops: [],
    }
  },
  methods: {
    cancel() {
      this.$store.commit("dialogs/clearAlternativeStopData")
    },
    saveAlternatives() {
      this.$store.dispatch("addStopAlternative", this.selectedStops)
    },
    addRemoveStop(id) {
      if (this.selectedStops.indexOf(id) > -1) {
        const index = this.selectedStops.indexOf(id)
        if (index > -1) {
          this.selectedStops.splice(index, 1) // 2nd parameter means remove one item only
        }
      } else {
        this.selectedStops.push(id)
      }
    },
  },
}
</script>
<style scoped>
div.new_stop_name {
  font-weight: bold;
}
div.row {
  display: flex;
}
div.old_stop {
  text-align: left;
  cursor: pointer;
}
div.old_stop_name {
  font-weight: 700;
}
div.old_address {
  font-size: 0.6rem;
}
button {
  margin-left: 0.15rem;
  margin-right: 0.15rem;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  cursor: pointer;
}
div.stop_date {
  font-size: 0.6rem;
}
</style>
