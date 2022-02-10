<template>
  <div class="main">
    <div v-for="func in availableFunctions" :key="func.id" class="row">
      <div>[{{ func.handler }}] {{ func.function }}</div>
      <button @click="runImportJob(func)">Run</button>
    </div>
  </div>
</template>
<script>
import axios from "axios"

export default {
  name: "AdminImportData",
  data() {
    return {
      availableFunctions: [],
    }
  },
  mounted() {
    axios({
      url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getDataImportFunctions",
      method: "get",
    }).then((res) => {
      //   console.log(res)
      this.availableFunctions = res.data.handlers
    })
  },
  methods: {
    runImportJob(func) {
      axios({
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/runDataImportFunction",
        method: "post",
        data: {
          func: func,
        },
      }).then((res) => {})
    },
  },
}
</script>
<style scoped>
div.main {
  margin-left: 2.5rem;
  width: 41.5rem;
  height: 20rem;
  background-color: white;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}
div.row {
  display: flex;
  flex-direction: row;
}
div.row div {
  margin-left: 0.5rem;
}
div.row button {
  margin-left: 1rem;
  cursor: pointer;
}
</style>
