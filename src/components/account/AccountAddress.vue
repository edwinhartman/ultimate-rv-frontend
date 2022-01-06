<template>
  <div class="main">
    <div>
      Address:
      <input
        type="text"
        name=""
        id=""
        class="address"
        v-model="address1"
        required
      />
    </div>
    <div>
      Address 2:
      <input
        type="text"
        name=""
        id=""
        class="address"
        v-model="address2"
        required
      />
    </div>
    <div>
      City:
      <input type="text" name="" id="" class="city" v-model="city" required />
    </div>
    <div>
      State:
      <select name="" id="" v-model="state">
          <option v-for="state in allStates" :key="state.abbreviation" :value="state.abbreviation">{{state.name}}</option>
      </select>
    </div>
    <div>
      Zip Code:
      <input
        type="text"
        name=""
        id=""
        class="zipcode"
        v-model="zipcode"
        required
      />
    </div>
    <div class="buttons">
      <button @click="updateAddress">Update</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "AccountAddress",
  data() {
    return {
      address1: "",
      address2: "",
      city: "",
      zipcode: "",
      state: ""
    };
  },
  mounted(){
      axios({
          url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/getUserAccountAddress",
          method:'get'
      }).then((res)=>{
          this.address1 = res.data.account.billing_address.address1
          this.address2 = res.data.account.billing_address.address2
          this.city = res.data.account.billing_address.city
          this.state = res.data.account.billing_address.state
          this.zipcode = res.data.account.billing_address.zipcode
      })
  },
  methods: {
    updateAddress() {
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/updateUserAccountAddress",
            method:'post',
            data:{
                address1:this.address1,
                address2:this.address2,
                city:this.city,
                state:this.state,
                zipcode:this.zipcode
            }
        }).then((res)=>{
          this.address1 = res.data.account.billing_address.address1
          this.address2 = res.data.account.billing_address.address2
          this.city = res.data.account.billing_address.city
          this.state = res.data.account.billing_address.state
          this.zipcode = res.data.account.billing_address.zipcode
        })
    },
  },
};
</script>
<style scoped>
* {
  font-size: 0.75rem;
}
div.main {
  display: flex;
  flex-direction: column;
  height: 80%;
}
input,select {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  border-radius: 0.5rem;
}
.address {
  width: 20rem;
}
div.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
div.buttons button {
  width: 5rem;
  cursor: pointer;
}

</style>