<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  mounted(){
    this.$store.commit('clearSharedSearchMarkers')
    navigator.geolocation.getCurrentPosition(pos => {
      this.$store.commit('setCurrentLocation',pos)
    }, err => {
      console.log(err.message)
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
