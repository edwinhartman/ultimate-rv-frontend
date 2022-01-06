<template>
    <div class="main">
        <table v-if="allPlans.length > 0">
            <tr v-for="plan in allPlans" :key="plan._id" :class="plan.active?'active':'inactive'">
                <td>{{ plan.name }}</td>
                <td>{{ plan.auto_payment }}</td>
                <td>{{ plan.demo }}</td>
                <td>{{ plan.expires }}</td>
                <td>{{ plan.price }}</td>
                <td>{{ plan.active }}</td>
            </tr>
        </table>
        <div v-if="allPlans.length == 0">No account plans defined</div>
        <button v-if="!showAddEditAcountDialog" @click="addNewAccountPlan">Add Account Plan</button>
        <div v-if="showAddEditAcountDialog" class="dialog">
            <div>Name: <input type="text" name="" id="" class="plan-name" v-model="plan_name"></div>
            <div>Description: <textarea name="" id="" cols="40" rows="5" v-model="plan_description"></textarea></div>
            <div>Interval:
                <select name="" id="" v-model="plan_interval">
                    <option value="0">None</option>
                    <option value="1">1 Month</option>
                    <option value="12">12 Months</option>
                    <option value="9999">Lifetime</option>
                </select>
            </div>
            <div>Active: <input type="checkbox" name="" id="" v-model="plan_active"></div>
            <div>Auto Payment: <input type="checkbox" name="" id="" v-model="plan_autopay"></div>
            <div>Demo Plan: <input type="checkbox" name="" id="" v-model="plan_demo"></div>
            <div>Plan Expires: <input type="checkbox" name="" id="" v-model="plan_expires"></div>
            <div>Price: <input type="number" name="" id="" v-model="plan_price"></div>
            <div class="buttons"><button @click="updateAccountPlan">Update</button></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name:"AdminAccountPlans",
    data(){
        return {
            showAddEditAcountDialog:false,
            allPlans:[],
            plan_id:null,
            plan_name:"",
            plan_description:"",
            plan_interval:-1,
            plan_autopay:false,
            plan_demo:false,
            plan_expires:true,
            plan_price:999,
            plan_active:true
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getAccountPlans",
            method:'get'
        }).then((res)=>{
            this.allPlans = res.data.plans
        })
    },
    methods:{
        addNewAccountPlan(){
            this.plan_id = null
            this.plan_name = ""
            this.plan_description = ""
            this.plan_interval = -1
            this.plan_autopay = false
            this.plan_demo = false
            this.plan_expires = true
            this.plan_price = 999
            this.plan_active = true
            this.showAddEditAcountDialog = true
        },
        updateAccountPlan(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/updateAccountPlan",
                method:'post',
                data:{
                    id:this.plan_id,
                    name:this.plan_name,
                    description:this.plan_description,
                    interval:this.plan_interval,
                    autopay:this.plan_autopay,
                    demo:this.plan_demo,
                    expires:this.plan_expires,
                    price:this.plan_price,
                    active:this.plan_active
                }
            }).then((res)=>{
                this.allPlans = res.data.plans
                this.showAddEditAcountDialog = false
            })
        }
    }
}
</script>
<style scoped>
* {
    font-size:0.7rem;
}
div.main{
    text-align: left;
    margin-left:2.5rem;
}
button{
    cursor: pointer;
    margin-top:0.5rem;
}
div.dialog{
    border: solid black 1px;
    border-radius: 0.3rem;
    margin-top:0.5rem;
    max-width:45rem;
    display: flex;
    flex-direction: column;
}
div.dialog div{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-left:0.2rem;
}
input,textarea{
    margin-top:0.1rem;
    margin-bottom:0.1rem;
    margin-left:0.1rem;
}
input.plan-name{
    width:30rem;
}
div.buttons{
    margin-right:5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top:0.2.rem;
    margin-bottom:0.2rem;
}
div.buttons button{
    width:5rem;
    cursor: pointer;
}
tr.active {
    background-color: rgba(30, 255, 79, 0.8);
}
tr.inactive {
    background-color: rgba(255, 36, 36, 0.8);
}
td:nth-child(1){
    width:20rem;
}
td:nth-child(2),td:nth-child(3),td:nth-child(4),td:nth-child(6){
    width:2rem;
}
td:nth-child(5){
    width:3rem;
}
</style>