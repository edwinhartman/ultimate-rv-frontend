<template>
  <div class="trip-card-container stacked" @click="setActive">
    <!-- <div :id="getCanvasID()"></div> -->
    <img :src="tripImage" class="trip-card-image" />
    <div>
      <div class="trip-card-name">{{ trip.name }}</div>
    </div>
    <img
      v-if="!trip.archived"
      src="/static/archive-icon.png"
      alt="Archive Trip"
      class="archive"
      @click.stop="archiveTrip()"
    />
    <img
      v-if="trip.archived"
      src="/static/trash-icon.png"
      alt="Remove Trip"
      class="remove"
      @click.stop="removeTrip()"
    />
  </div>
</template>
<script>
export default {
  name: "OpenTripCard",
  props: {
    trip: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tripImage: null,
    }
  },
  methods: {
    getCanvasID() {
      console.log(this.trip)
      return "_canvas_" + this.trip._id
    },
    setActive() {
      this.$store.dispatch("activateTrip", this.trip._id).then(() => {
        this.zoomToTrip(this.$store.state.activeTrip, this.$store)
        this.$store.commit("setShowOpenExistingTrip", false)
      })
    },
    archiveTrip() {
      this.$store.dispatch("archiveTrip", this.trip._id).then(() => {
        this.$emit("doRefresh", true)
      })
    },
    removeTrip() {
      this.$store.dispatch("removeTrip", this.trip._id).then(() => {
        this.$emit("doRefresh", true)
      })
    },
  },
  mounted() {
    if (this.trip.snapshot != null && this.trip.snapshot.length > 0) {
      this.tripImage = this.trip.snapshot[0].tripImage
    } else {
      this.tripImage = "/static/not-available.png"
    }
  },
}
</script>
<style scoped>
div.trip-card-container {
  max-width: 10rem;
  margin: 0.15rem;
  padding: 0.2rem;
  aspect-ratio: 1 / 1.25;
  cursor: pointer;
  position: relative;
}
.stacked {
  display: grid;
}
.stacked > * {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
}
img.trip-card-image {
  /* width: 200px;
  height: 200px; */
  max-width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.75rem;
}
div.trip-card-name {
  background: rgb(255 255 255 / 0.8);
  align-self: end;
  font-weight: bold;
  width: 100%;
  text-align: center;
  /* margin: 0.5rem 0.5rem 2rem; */
  margin-top: 9rem;
  box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 0.2);
  border-radius: 0.2rem;
  font-size: 1.2rem;
  line-height: 1.1;
}
img.archive,
img.remove {
  position: absolute;
  top: 0.15rem;
  right: 0.15rem;
  aspect-ratio: 1 / 1;
  width: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(80, 80, 80, 0.2);
}
</style>
