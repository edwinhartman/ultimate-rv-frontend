<template>
  <div class="main">
    <table>
      <tr>
        <td>Name</td>
        <td>Email</td>
        <td>Plan</td>
      </tr>
      <tr
        v-for="user in users"
        :key="user._id"
        :class="user.active ? 'active' : 'inactive'"
        @click="editUser(user)"
      >
        <td>{{ user.firstName }} {{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.account.account.plan.name }}</td>
      </tr>
    </table>
    <div v-if="showAddEditForm && currentUser != null">
      <AdminTabs v-model="active">
        <AdminTab title="General">
          <div class="tab-content">
            <div>
              First Name:
              <input
                type="text"
                name=""
                id=""
                class="name"
                v-model="firstName"
              />
            </div>
            <div>
              Last Name:
              <input
                type="text"
                name=""
                id=""
                class="name"
                v-model="lastName"
              />
            </div>
            <div>
              Email:
              <input type="text" name="" id="" class="email" v-model="email" />
            </div>
            <div>
              Active:
              <input type="checkbox" name="" id="" v-model="userActive" />
            </div>
          </div>
        </AdminTab>
        <AdminTab title="Settings">
          <div class="tab-content">
            <textarea v-model="userSettings" rows="30" cols="50"></textarea>
          </div>
        </AdminTab>
        <AdminTab title="Account">
          <div class="tab-content">
            <button
              v-if="
                (!currentUser.account || currentUser.account == null) &&
                userID != null
              "
              @click="initAccount"
            >
              Initialize Account
            </button>
            <div v-if="currentUser.account && currentUser.account.account">
              <div>Plan:
                <select name="" id="" v-model="userPlan">
                  <option v-for="plan in allPlans" :key="plan._id" :value="plan._id">{{ plan.name }}</option>
                </select>
              </div>
                <div>
                    Owner: <input type="checkbox" name="" id="" v-model="currentUser.account.owner">
                </div>
              <div>
                Active:
                <input
                  type="checkbox"
                  name=""
                  id=""
                  v-model="currentUser.account.account.active"
                />
              </div>
              <div>
                Next Billing: {{ getDateTimeFormatted(currentUser.account.account.next_billing_dttm) }}
              </div>
            </div>
          </div>
        </AdminTab>
      </AdminTabs>
      <button @click="save">Save</button><button @click="cancel">Cancel</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import AdminTabs from "../components/AdminTabs.vue";
import AdminTab from "../components/AdminTab.vue";
import { ref } from "@vue/reactivity";

export default {
  name: "AdminUsers",
  components: {
    AdminTabs,
    AdminTab,
  },
  setup() {
    const active = ref(0);
    return { active };
  },
  data() {
    return {
      users: [],
      showAddEditForm: false,
      currentUser: null,
      userID: null,
      userSettings: "{}",
      firstName: "",
      lastName: "",
      email: "",
      userActive: false,
      allPlans:[],
      userPlan:null
    };
  },
  mounted() {
    axios({
      url:
        process.env.VUE_APP_BACKEND_CONNECTION_URI +
        "/admin/getAllUserAccounts",
      method: "get",
    }).then((res) => {
      console.log(res)
      this.users = res.data.users;
    });
    axios({
      url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getAccountPlans",
      method:'get'
    }).then((res)=>{
      this.allPlans = res.data.plans
    })
  },
  methods: {
    editUser(user) {
      this.currentUser = user;
      this.showAddEditForm = true;
      if (user.settings == "") {
        this.userSettings = "{}";
      } else {
        // console.log(user.settings);
        this.userSettings = JSON.stringify(JSON.parse(user.settings), null, 2);
      }
      this.userID = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.userActive = user.active;
      this.userPlan = user.account.account.plan._id
    },
    save() {
      let settings = JSON.stringify(
        JSON.parse(this.userSettings.replace(/(\r\n|\n|\r)/gm, ""))
      );
      let accnt = null
      if (this.currentUser.account){
          accnt = this.currentUser.account
      }
      axios({
        url:
          process.env.VUE_APP_BACKEND_CONNECTION_URI +
          "/admin/updateUserAccount",
        method: "post",
        data: {
          id: this.userID,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          active: this.userActive,
          settings: settings,
          account:accnt,
          plan:this.userPlan
        },
      }).then((res) => {
        this.users = res.data.users;
      });
      this.showAddEditForm = false;
    },
    cancel() {
      this.showAddEditForm = false;
    },
    initAccount() {
      axios({
        url:
          process.env.VUE_APP_BACKEND_CONNECTION_URI +
          "/admin/initializeAccount",
        method: "post",
        data: {
          user_id: this.userID,
        },
      }).then((res) => {
        this.users = res.data.users;
        let usr = res.data.users.filter((u) => {
          return u._id == this.userID;
        });
        console.log("here");
        console.log(usr);
        this.editUser(usr[0]);
      });
    },
  },
};
</script>
<style scoped>
* {
  font-size: 0.7rem;
}
div.main {
  text-align: left;
  margin-left: 2.5rem;
}
table td:nth-child(1) {
  width: 16rem;
  border-left: solid black 1px;
}
table td:nth-child(2) {
  width: 15rem;
}
table td:nth-child(3) {
  width:15rem;
  border-right: solid black 1px;
}
table tr:not(:first-child) {
  cursor: pointer;
}
tr.active {
  background-color: rgba(88, 255, 66, 0.8);
}
tr.inactive {
  background-color: rgba(255, 70, 70, 0.8);
}
table td {
  border-top: solid black 1px;
  border-bottom: solid black 1px;
}
input {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}
input.name {
  width: 20rem;
}
input.email {
  width: 25rem;
}
div.tab-content {
  margin-left: 2.5rem;
  max-width: 40rem;
}
button {
  margin-top: 0.5rem;
  margin-left: 2rem;
  width: 4rem;
}
</style>