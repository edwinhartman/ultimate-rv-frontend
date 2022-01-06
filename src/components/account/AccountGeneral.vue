<template>
        <div>
            <div>
                <label for="FirstName">First Name</label>
                <input type="text" name="FirstName" class="name" v-model="firstName">
            </div>
            <div>
                <label for="LastName" class="mr-2">Last Name</label>
                <input type="text" name="LastName" class="name" v-model="lastName">
            </div>
            <div>
                <label for="EmailAddress" >Email</label>
                <input type="email" name="EmailAddress" class="email" v-model="email">
            </div>
            <div class="buttons">
                <button @click="updateUserInfo">Update</button>
            </div>
        </div>
</template>
<script>
import axios from 'axios'

export default {
    name:"AccountGeneral",
    data(){
        return {
            firstName:"",
            lastName:"",
            email:""
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/getUserAccountGeneralInfo",
            method:'get'
        }).then((res)=>{
            this.firstName = res.data.user.firstName
            this.lastName = res.data.user.lastName
            this.email = res.data.user.email
        })
    },
    methods:{
        updateUserInfo(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/updateUserAccountGeneralInfo",
                method:'post',
                data:{
                    firstName:this.firstName,
                    lastName:this.lastName,
                    email:this.email
                }
            }).then((res)=>{
                this.firstName = res.data.user.firstName
                this.lastName = res.data.user.lastName
                this.email = res.data.user.email
            })
        }
    }
}
</script>
<style scoped>
*{
    font-size:0.7rem;
}
input{
    border-radius: 0.3rem;
    margin-left:0.5rem;
    margin-top:0.1rem;
    margin-bottom:0.1rem;
}
input.name{
    width:15rem;
}
input.email{
    width:20rem;
}
div.buttons{
    display: flex;
    justify-content: center;
    margin-top:0.5rem;
}
div.buttons button {
    cursor: pointer;
    width:5rem;
}
</style>