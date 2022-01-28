<template>
  <div v-if="$store.state.editStopDateStop != null" class="edit-route-stop-date">
    <div>{{ $store.state.editStopDateStop.route.route.name }}</div>
    <div>{{ $store.state.editStopDateStop.stop.stop.name }}</div>
    <div>Departure Date <input type="date" v-model="_stop_date" :min="getMinDate()" :max="getMaxDate()" /></div>
    <div>
      <button v-if="_date_set" @click="clear()">Clear</button>
      <button @click="cancel()">Cancel</button>
      <button @click="updateStopDate()">OK</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditTripStopDate",
  data() {
    return {
      stop_date: null,
    }
  },
  computed: {
    _stop_date: {
      get() {
        if (this.stop_date == null) {
          return ""
        } else {
          return this.stop_date.toISOString().split("T")[0]
        }
      },
      set(newVal) {
        this.stop_date = new Date(newVal + "T00:00:00.000Z")
      },
    },
    _date_set: {
      get() {
        if (this.$store.state.editStopDateStop.stop_idx > -1) {
          if (
            this.$store.state.editStopDateStop.route.route.dates.length > this.$store.state.editStopDateStop.stop_idx &&
            this.$store.state.editStopDateStop.route.route.dates[this.$store.state.editStopDateStop.stop_idx] != null &&
            this.$store.state.editStopDateStop.route.route.dates[this.$store.state.editStopDateStop.stop_idx] != ""
          ) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
    },
  },
  mounted() {
    // console.log(this.$store.state.editStopDateStop)
    if (this.$store.state.editStopDateStop.stop_idx > -1) {
      if (
        this.$store.state.editStopDateStop.route.route.dates.length > this.$store.state.editStopDateStop.stop_idx &&
        this.$store.state.editStopDateStop.route.route.dates[this.$store.state.editStopDateStop.stop_idx] != null &&
        this.$store.state.editStopDateStop.route.route.dates[this.$store.state.editStopDateStop.stop_idx] != ""
      ) {
        this.stop_date = new Date(
          this.$store.state.editStopDateStop.route.route.dates[this.$store.state.editStopDateStop.stop_idx]
        )
      } else {
        if (this.$store.state.editStopDateStop.route.route.dates.length > 0) {
          console.log(
            this.$store.state.editStopDateStop.route.route.dates[
              this.$store.state.editStopDateStop.route.route.dates.length - 1
            ]
          )
          this.stop_date = new Date(
            this.$store.state.editStopDateStop.route.route.dates[
              this.$store.state.editStopDateStop.route.route.dates.length - 1
            ]
          )
        } else {
          this.stop_date = new Date()
        }
      }
    } else {
      this.stop_date = new Date()
    }
  },
  methods: {
    cancel() {
      this.$store.commit("clearEditStopDateStop")
    },
    clear() {
      this.$store.dispatch("updateTripStopDate", {
        route_id: this.$store.state.editStopDateStop.route.route._id,
        stop_id: this.$store.state.editStopDateStop.stop.stop._id,
        stop_idx: this.$store.state.editStopDateStop.idx,
        date: null,
      })
    },
    updateStopDate() {
      this.$store.dispatch("updateTripStopDate", {
        route_id: this.$store.state.editStopDateStop.route.route._id,
        stop_id: this.$store.state.editStopDateStop.stop.stop._id,
        stop_idx: this.$store.state.editStopDateStop.stop_idx,
        date: this.stop_date,
      })
    },
    getMinDate() {
      if (this.$store.state.editStopDateStop.route.route.dates.length > this.$store.state.editStopDateStop.stop_idx) {
        for (let i = this.$store.state.editStopDateStop.stop_idx; i > -1; i--) {
          if (
            this.$store.state.editStopDateStop.route.route.dates[i] != null &&
            this.$store.state.editStopDateStop.route.route.dates[i] != "" &&
            !this.$store.state.editStopDateStop.route.route.stops[i].daytrip
          ) {
            let last_main_stop_idx = i
            if (
              this.$store.state.editStopDateStop.route.route.stops[this.$store.state.editStopDateStop.stop_idx].daytrip
            ) {
              last_main_stop_idx--
              while (this.$store.state.editStopDateStop.route.route.stops[last_main_stop_idx].daytrip) {
                last_main_stop_idx--
              }
            }
            let d = this.$store.state.editStopDateStop.route.route.dates[last_main_stop_idx]
            var date = d.substring(0, 10).split("-")
            date = date[0] + "-" + date[1] + "-" + date[2]
            return date
          }
        }
        return ""
      } else {
        if (this.$store.state.editStopDateStop.route.route.dates.length > 0) {
          let last_main_stop_idx = this.$store.state.editStopDateStop.stop_idx - 1
          while (this.$store.state.editStopDateStop.route.route.stops[last_main_stop_idx].daytrip) {
            last_main_stop_idx--
          }
          if (
            this.$store.state.editStopDateStop.route.route.stops[this.$store.state.editStopDateStop.stop_idx].daytrip
          ) {
            let last_main_stop_idx = last_main_stop_idx - 1
            while (this.$store.state.editStopDateStop.route.route.stops[last_main_stop_idx].daytrip) {
              last_main_stop_idx--
            }
          }
          let d = this.$store.state.editStopDateStop.route.route.dates[last_main_stop_idx]
          var date2 = d.substring(0, 10).split("-")
          date2 = date2[0] + "-" + date2[1] + "-" + date2[2]
          return date2
        } else {
          return ""
        }
      }
      // if (this.getMaxDate() == "2099-12-31"){
      // let d = new Date()
      // var date = d.toISOString().substring(0,10).split('-')
      // date = date[0] + "-" + date[1] + "-" + date[2]
      // return date
      // }else{
      //     return ""
      // }
    },
    getMaxDate() {
      if (
        this.$store.state.editStopDateStop.route.route.dates.length >
        this.$store.state.editStopDateStop.stop_idx + 1
      ) {
        for (
          let i = this.$store.state.editStopDateStop.stop_idx;
          i < this.$store.state.editStopDateStop.route.route.dates.length;
          i++
        ) {
          if (
            this.$store.state.editStopDateStop.route.route.dates[i] != null &&
            this.$store.state.editStopDateStop.route.route.dates[i] != ""
          ) {
            let d = this.$store.state.editStopDateStop.route.route.dates[i]
            var date = d.substring(0, 10).split("-")
            date = date[0] + "-" + date[1] + "-" + date[2]
            return date
          }
        }
        return "2099-12-31"
      } else {
        return "2099-12-31"
      }
    },
  },
}
</script>
<style scoped>
.edit-route-stop-date {
  display: flex;
  flex-direction: column;
}
.edit-route-stop-date div:nth-child(2),
.edit-route-stop-date div:nth-child(3) {
  margin-bottom: 0.2rem;
}
button {
  margin-right: 0.1rem;
  cursor: pointer;
}
</style>
