<template>
    <div>
        <form @submit.prevent="registerUser">
        <table>
            <tr><td>First Name</td><td><input type="text" v-model="firstName" required></td></tr>
            <tr><td>Last Name</td><td><input type="text" v-model="lastName" required></td></tr>
            <tr><td>Email</td><td><input type="text" v-model="email" required></td></tr>
            <tr><td>Password</td><td><input type="password" v-model="password" required></td></tr>
            <tr><td>Confirm Password</td><td><input type="password" v-model="confirmPassword" required></td></tr>
            <tr><td colspan="2"><button  type="submit">Register</button></td></tr>
        </table>
        </form>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name:'NewAccount',
    data(){
        return {
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    },
    methods:{
        registerUser(){
            const { firstName,lastName,email,password } = this;
            
            axios({
                method:'post',
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/registerUser",
                data:{
                    firstName,
                    lastName,
                    email,
                    password
                }
            }).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>