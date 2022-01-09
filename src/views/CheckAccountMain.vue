<template>
  <div class="main">
      <form v-if="user && user.account.account && !user.account.account.review_requested">
    <div class="content">
      <div class="title">Check Account</div>
      <div class="error">{{ message }}</div>
      <div
        class="account"
        v-if="
          user != null &&
          user.account &&
          user.account.account &&
          user.account.account != null
        "
      >
        <div
          class="error"
          v-if="
            user.account.account.error_message &&
            user.account.account.error_message != ''
          "
        >
          {{ user.account.account.error_message }}
        </div>
        <table>
          <tr>
            <td>First Name</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="name"
                v-model="user.firstName"
                required
              />
            </td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="name"
                v-model="user.lastName"
                required
              />
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="email"
                v-model="user.email"
                readonly
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="address"
                v-model="user.account.account.billing_address.address1"
                required
              />
            </td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="address"
                v-model="user.account.account.billing_address.address2"
              />
            </td>
          </tr>
          <tr>
            <td>City</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="city"
                v-model="user.account.account.billing_address.city"
                required
              />
            </td>
          </tr>
          <tr>
            <td>State</td>
            <td>
              <select
                name=""
                id=""
                class="state"
                v-model="user.account.account.billing_address.state"
                required
              >
                <option
                  v-for="state in allStates"
                  :key="state.abbreviation"
                  :value="state.abbreviation"
                >
                  {{ state.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Zipcode</td>
            <td>
              <input
                type="text"
                name=""
                id=""
                class="zipcode"
                v-model="user.account.account.billing_address.zipcode"
                required
              />
            </td>
          </tr>
          <tr>
              <td colspan="2">&nbsp;</td>
          </tr>
          <tr v-show="!add_new_card">
            <td colspan="2">
                <table class="cc_cards">
                    <tr v-for="billing_account in user.account.account.payment_method" :key="billing_account._id">
                        <td v-if="billing_account.primary">{{ billing_account.primary }}</td>
                        <td v-if="!billing_account.primary"><button class="set-primary" type="button" @click="setPrimary(billing_account)">Set As Primary</button></td>
                        <td>{{ billing_account.billing_account.name }}</td>
                        <td :class="billing_account.billing_account.active?'active':'inactive'">{{ billing_account.billing_account.active?"Active":"Inactive" }}</td>
                    </tr>
                    <tr><td colspan="3"><button type="button" @click="addNewCard">Add New Card</button></td></tr>
                </table>
            </td>
          </tr>
          <tr v-show="add_new_card">
              <td colspan="2">
                  <NewPaymentMethod :new_customer="false" @updateParent="updateNewPaymentMethod" />
              </td>
          </tr>
        </table>
      </div>
      <div class="buttons">
          <button type="submit">Update</button>
          <button type="button" @click="requestReview">Request Account Review</button>
      </div>
    </div>
      </form>
      <div v-if="user && user.account.account && user.account.account.review_requested" class="content">
          <div class="title">Account Review</div>
          <div>Your account is being reviewed. You will be notified by email when the review is complete. Additional actions from you might be required based on our findings.</div>
      </div>
  </div>
</template>
<script>
import axios from "axios";
import NewPaymentMethod from '../components/account/NewPaymentMethod.vue'
export default {
  name: "CheckAccountMain",
  components:{
      NewPaymentMethod
  },
  data() {
    return {
      error_code: -1,
      message: "",
      user: null,
      add_new_card:false
    };
  },
  created() {
    this.error_code = this.$route.params.error_code;
    // console.log(this.BackendErrorCodes)
    this.message = this.BackendErrorCodes.filter((e) => {
      return e.code == this.error_code;
    })[0].msg;
  },
  mounted() {
    axios({
      url:
        process.env.VUE_APP_BACKEND_CONNECTION_URI +
        "/accountValidation/getUserDetails",
      method: "get",
    }).then((res) => {
      console.log(res);
      this.user = res.data.user;
    });
  },
  methods:{
      addNewCard(){
          this.add_new_card = true
      },
      updateNewPaymentMethod(data){
          if (!data || data == null){
              this.add_new_card = false
          }
      },
      requestReview(){
          axios({
      url:
        process.env.VUE_APP_BACKEND_CONNECTION_URI +
        "/accountValidation/requestAccountReview",
      method: "get",
    }).then((res) => {
      this.user = res.data.user;
    });
      }
  }
};
</script>
<style scoped>
* {
  font-size: 0.8rem;
}
div.main {
  /* padding-top:5rem; */
  margin: auto;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
div.content {
  width: 35rem;
  border: solid black 1px;
  border-radius: 0.2rem;
  /* box-shadow: 0.15em 0.15em rgba(110, 110, 110,.5); */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
}

div.title {
  font-weight: bold;
  font-size: 1.2rem !important;
}
div.error {
  color: red;
  font-weight: bold;
  padding-top: 0.15rem;
  padding-bottom: 0.15rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border: solid red 1px;
  border-radius: 0.2rem;
  margin-top: 0.1rem;
}
table tr td {
  text-align: left;
}
input.name,
input.city {
  width: 15rem;
}
input.email,
input.address {
  width: 20rem;
  color: rgb(71, 71, 71);
}
input.zipcode {
  width: 4.5rem;
}
button{
    margin-top:1rem;
    width:12rem;
}
.buttons button:last-child{
    margin-left:0.5rem;
}
table.cc_cards{
    width:100%;
}
td.active{
    color:green;
    font-weight: bold;
}
td.inactive{
    color: red;
    font-weight: bold;
}
button.set-primary{
    font-size:0.5rem;
    width:3rem;
}
</style>