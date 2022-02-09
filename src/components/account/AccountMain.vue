<template>
  <div class="main">
    <Tabs v-model="active">
      <Tab title="General">
        <AccountGeneral />
      </Tab>
      <Tab title="Address">
        <AccountAddress />
      </Tab>
      <Tab title="Plan Info">
        <AccountPlan />
      </Tab>
      <Tab title="Payment">
        <AccountPayment />
      </Tab>
    </Tabs>
    <div class="buttons">
      <button @click="logoutUser">Logout</button>
      <button @click="$store.commit('setShowAccountMaintenance', !$store.state.accountMaintenanceActive)">Close</button>
    </div>
  </div>
</template>
<script>
import Tabs from "../common/Tabs.vue"
import Tab from "../common/Tab.vue"

import AccountGeneral from "./AccountGeneral.vue"
import AccountPayment from "./AccountPayment.vue"
import AccountAddress from "./AccountAddress.vue"
import AccountPlan from "./AccountPlan.vue"

import { ref } from "@vue/reactivity"

export default {
  name: "AccountMain",
  setup() {
    const active = ref(0)

    return { active }
  },
  components: {
    Tabs,
    Tab,
    AccountGeneral,
    AccountPayment,
    AccountAddress,
    AccountPlan,
  },
  methods: {
    logoutUser() {
      this.$store.dispatch("logoutUser")
    },
  },
}
</script>
<style scoped>
* {
  font-size: 0.8rem;
}
div.main {
  text-align: left;
  width: 35rem;
  min-height: 10rem;
  max-height: 36rem;
}
div.buttons {
  display: flex;
  justify-content: flex-end;
}
button {
  margin-top: 0.5rem;
  cursor: pointer;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  box-shadow: 0.15rem 0.15rem 0.5rem rgba(80, 80, 80, 0.6);
}
</style>
