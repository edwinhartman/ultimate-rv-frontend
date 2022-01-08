<template>
<div>
    <div class="main" v-if="user != null">
        <div v-if="step==1" class="shadow-big">
            <div class="title">Welcome {{ user.firstName }}!</div>
            <div>
                Thank you for registering as a new user for Ultimate-RV! 
            </div>
            <div>
                Now that you have confirmed your email, we will walk to you through completing your account setup.
            </div>
            <div>
                <button @click="step++">Let's Get Started!</button>
            </div>
        </div>
        <div v-if="step==2" class="shadow-big">
             <form @submit.prevent="nextStep2">
            <div class="title">Billing Address</div>
            <div class="notes">The billing information is used for billing your account.</div>
            <div>
               
                <table>
                    <tr>
                        <td>Address:</td>
                        <td><input type="text" name="" id="" class="address" v-model="address.address1" required></td>
                    </tr>
                    <tr>
                        <td>Address:</td>
                        <td><input type="text" name="" id="" class="address" v-model="address.address2"></td>
                    </tr>
                    <tr>
                        <td>City:</td>
                        <td><input type="text" name="" id="" class="city" v-model="address.city" required></td>
                    </tr>
                    <tr>
                        <td>State:</td>
                        <td>
                            <select name="" id="" v-model="address.state" required>
                                <option v-for="state in allStates" :key="state.abbreviation" :value="state.abbreviation">{{ state.name }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Zipcode:</td>
                        <td><input type="text" name="" id="" class="zipcode" v-model="address.zipcode" required></td>
                    </tr>
                </table>
            </div>
            <div>
                <button type="submit" >Next Step</button>
            </div>
                </form>
        </div>
        <div v-if="step==3" class="shadow-big">
            <form  @submit.prevent="nextStep3">
            <div class="title">Select Plan</div>
            <div class="notes">Select the plan that will meet your needs.</div>
            <div>
                <select name="" id="" class="plan" v-model="plan" required>
                    <option v-for="plan in plans" :key="plan._id" :value="plan">{{ plan.name }} - {{ formatAmount(plan.price) }}</option>
                </select>
            </div>
            <div v-if="plan && plan!=null">
                {{ plan.description }}
            </div>
            <div class="buttons"><button type="submit">Next Step</button></div>
            </form>
        </div>
        <div v-if="step==4" class="shadow-big">
            <div class="title">Payment Information</div>
            <div class="cc_box">
                <NewPaymentMethod :new_customer="true" @updateParent="nextStep4" :new_customer_id="sq_customer_id" />
            </div>
        </div>
        <div v-if="step==5" class="shadow-big">
            <div class="title">Confirmation</div>
            <div>Name: {{ user.firstName }} {{ user.lastName }}</div>
            <div>Email: {{ user.email }}</div>
            <div class="address">Address: {{ formatAddress() }}</div>
            <div>Selected Plan: {{ plan.name }}</div>
            <div v-if="!plan.demo">Payment Info: {{ card_data[0].billing_account.name }}</div>
            <div class="notes2">By clicking the 'Start Using Ultimate-RV' button below, you agree to terms and conditions of the Ultimate-RV application. {{ getSummary() }}, you will receive an email confirmation after which you can start using the application. Thanks again for choosing Ultimate-RV!</div>
            <div class="buttons"><button @click="bringToLoginScreen">Start Using Ultimate-RV!</button></div>
        </div>
    </div>
    <div class="main" v-if="!user || user == null"><div class="error shadow-big">Registration not found or already processed.</div></div>
</div>
</template>
<script>
import axios from 'axios'
import NewPaymentMethod from '../components/account/NewPaymentMethod.vue'

export default {
    name:"NewAccountSetup",
    components:{
        NewPaymentMethod
    },
    data(){
        return {
            step:1,
            user:null,
            plans:[],
            address:{
                address1:"",
                address2:"",
                city:"",
                state:"",
                zipcode:""
            },
            plan:null,
            card_data:null,
            sq_customer_id:""
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/getRegistrationInfo",
            method:'post',
            data:{
                reg_id:this.$route.params.reg_id
            }
        }).then((res)=>{
            this.user = res.data.user
            this.plans = res.data.plans
        })
    },
    methods:{
        bringToLoginScreen(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/finishRegistration",
                method:'post',
                data:{
                    user:this.user
                }
            }).then((res)=>{

                this.$router.push({name:"Home"})
            })
        },
        nextStep2(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/createUserAccount",
                method:'post',
                data:{
                    user:this.user,
                    address:this.address
                }
            }).then((res)=>{
                this.user = res.data.user
                this.step++
            })
            
        },
        nextStep3(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/addPlanToAccountRegistration",
                method:'post',
                data:{
                    user:this.user,
                    plan:this.plan
                }
            }).then((res)=>{
                this.user = res.data.user
                    this.sq_customer_id = res.data.user.account.account.square_customer_id
            this.plan.demo?this.step+=2:this.step+=1
            })
        },
        nextStep4(data){
            this.card_data = data
            this.step++
        },
        formatAddress(){
            let s = this.address.address1 + " "
            if (this.address.address2 != ""){
                s += this.address.address2 + " "
            }
            s += this.address.city + ", " + this.address.state + " " + this.address.zipcode
            return s
        },
        getSummary(){
            if (this.plan.demo){
                return "After the system finishes your account setup"
            }else{
                return "After your payment is processed and the system finishes your account setup"
            }
        }
    }
}
</script>
<style scoped>
* {
    font-size:0.8rem;
}
div.main{
    /* padding-top:5rem; */
    margin:auto;
    display: flex;
    justify-content: center;
    margin-top:13rem;
}
div.main>div{
    width:25rem;
    border:solid black 1px;
    border-radius: 0.2rem;
    /* box-shadow: 0.15em 0.15em rgba(110, 110, 110,.5); */
    display: flex;
    flex-direction: column;
    padding:1rem;
}

div.main>div>div{
    text-align: left;
    margin-bottom:0.15rem;
}
div.main>div>div:last-child{
    text-align: center;
}
div.main>div>form>div{
    text-align: left;
    margin-bottom:0.15rem;
}
div.main>div>form>div:last-child{
    text-align: center;
}
button{
    font-size:0.6rem;
    margin-top:0.2rem;
    cursor: pointer;
}
div.title{
    text-align: center !important;
    font-weight: bold;
}
input.address{
    width:20rem;
}
input.city{
    width:10rem;
}
input.zipcode{
    width:8rem;
}
select.plan {
    width:25rem;
}
div.notes{
    font-size:0.7rem;
    margin-top:0.2rem;
    padding-bottom:0.5rem;
}
div.notes2{
    font-size:0.7rem;
    margin-top:0.4rem;
    padding-bottom:0.8rem;
    text-align: center;
}
div.error{
    padding:1rem;
    color:red;
    border:solid red 1px;
    width:15rem;
    border-radius: 0.2rem;
    display: flex;
    justify-content: center;
    background-color: white;
}
div.cc_box {
    width:25rem;
}
div.address {
    margin-top:0.2rem;
    margin-bottom:0.2rem;
}
</style>