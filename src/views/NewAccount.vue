<template>
    <div class="main">
        <div v-if="!confirmation" class="shadow-big">
        <div v-if="error_msg != ''" class="error">
            {{error_msg}}
        </div>
        <div class="title">Ultimate-RV Registration</div>
        <form @submit.prevent="registerUser">
        <table>
            <tr><td>First Name</td><td><input type="text" class="name" v-model="firstName" placeholder="First Name" required></td></tr>
            <tr><td>Last Name</td><td><input type="text" class="name" v-model="lastName" placeholder="Last Name" required></td></tr>
            <tr><td>Email</td><td><input type="text" class="email" v-model="email" placeholder="Email Address" required></td></tr>
            <tr><td>Password</td><td><input type="password" v-model="password" :class="password_error?'error':''" placeholder="Password" required></td></tr>
            <tr><td>Confirm Password</td><td><input type="password" v-model="confirmPassword" :class="password_error?'error':''" placeholder="Repeat Password" required></td></tr>
            <tr><td colspan="2" class="buttons">
                <button  type="submit">Register</button>
                <button type="button" @click="cancelRegistration">Cancel</button>
            </td></tr>
        </table>
        </form>
        </div>
        <div v-if="confirmation" class="shadow-big">
            Thank you for your registration. An email has been send to {{ email }}. Please follow the instructions provided in the email.
        </div>
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
            confirmPassword:"",
            password_error:false,
            error_msg:"",
            confirmation:false
        }
    },
    methods:{
        registerUser(){
            this.password_error = false
            this.error_msg = ""
            if (this.password !== this.confirmPassword){
                this.error_msg = "Passwords do not match."
                this.password = ""
                this.confirmPassword = ""
                this.password_error = true
                return
            }
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
                if (res.data.failed){
                    this.error_msg = res.data.error
                }else{
                    this.confirmation = true
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        cancelRegistration(){
            this.$router.push({name:'Home'})
        }
    }
}
</script>
<style scoped>
* {
    font-size:0.8rem;
}
div.main{
    display:flex;
    flex-direction: column;
    /* width:100%; */
    margin-top:13rem;
    justify-content: center;
    align-items: center;
    padding:0.4rem;
    
}
div.main>div{
    padding:0.3rem;
    border:solid black 1px;
    border-radius: 0.2rem;
    /* box-shadow: 0.25em 0.25em rgba(110, 110, 110,.5); */
    background-color: white;
}
table>tr>td{
    text-align: left;
}
.buttons{
    text-align: center !important;
    padding-top:0.4rem;
    padding-bottom:0.2rem;
}
.buttons button{
    cursor: pointer;
}
.buttons button:last-child {
    margin-left:0.5rem;
}
div.error{
    color: red;
    padding:0.2rem;
    border: solid red 1px;
    border-radius: 0.2rem;
    margin-bottom:0.2rem;
}
input.error{
    background-color: red;
}
input.name{
    width:20rem;
}
input.email{
    width:25rem;
}
div.title{
    font-weight: bold;
    font-size:1rem !important;
    margin-bottom:0.5rem;
}
</style>