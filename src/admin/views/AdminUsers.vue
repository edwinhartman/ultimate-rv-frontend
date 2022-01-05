<template>
    <div class="main">
        <table>
            <tr>
                <td>Name</td>
                <td>Email</td>
            </tr>
            <tr v-for="user in users" :key="user._id" :class="user.active ? 'active':'inactive'" @click="editUser(user)">
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>

            </tr>
        </table>
        <div v-if="showAddEditForm && currentUser != null">
            <AdminTabs v-model="active">
                <AdminTab title="General">
                    <div class="tab-content">
                        <div>First Name: <input type="text" name="" id="" class="name" v-model="firstName"></div>
                        <div>Last Name: <input type="text" name="" id="" class="name" v-model="lastName"></div>
                        <div>Email: <input type="text" name="" id="" class="email" v-model="email"></div>
                    </div>
                </AdminTab>
                <AdminTab title="Settings">
                    <div class="tab-content">
                        <textarea v-model="userSettings" rows="30" cols="50"></textarea>
                        
                    </div>
                </AdminTab>
                <AdminTab title="Account">
                    <div class="tab-content">Account</div>
                </AdminTab>
            </AdminTabs>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import AdminTabs from '../components/AdminTabs.vue'
import AdminTab from '../components/AdminTab.vue'
import { ref } from '@vue/reactivity'

export default {
    name:"AdminUsers",
    components:{
        AdminTabs,
        AdminTab
    },
    setup(){
        const active=ref(0)
        return {active}
    },
    data(){
        return {
            users:[],
            showAddEditForm:false,
            currentUser:null,
            userSettings:"{}",
            firstName:"",
            lastName:"",
            email:""
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getAllUserAccounts",
            method:'get'
        }).then((res)=>{
            // console.log(res)
            this.users = res.data.users
        })
    },
    methods:{
        editUser(user){
            this.currentUser = user
            this.showAddEditForm = true
            this.userSettings = JSON.stringify(JSON.parse( user.settings),null,2)
            this.firstName = user.firstName
            this.lastName = user.lastName
            this.email = user.email
        }
    }
}
</script>
<style scoped>
*{
    font-size:0.7rem;
}
div.main{
    text-align: left;
    margin-left: 2.5rem;
}
table td:nth-child(1){
    width:16rem;
    border-left:solid black 1px;
}
table td:nth-child(2){
    width:15rem;
    border-right:solid black 1px;
}
table tr:not(:first-child){
    cursor: pointer;
}
tr.active{
    background-color: rgba(88, 255, 66, 0.8);
}
tr.inactive{
    background-color: rgba(255, 70, 70, 0.8);
}
table td{
    border-top: solid black 1px;
    border-bottom:solid black 1px;
}
input {
    margin-top:0.1rem;
    margin-bottom:0.1rem;
}
input.name{
    width:20rem;
}
input.email{
    width:25rem;
}
div.tab-content {
    margin-left:2.5rem;
    max-width:40rem;
}
</style>