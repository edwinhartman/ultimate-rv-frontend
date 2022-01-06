<template>
    <div>
        <button v-if="!showPaymentMethodDialog" @click="addNewPaymentMethod">Add New Method</button>
        <table v-if="!showPaymentMethodDialog">
            <tr>
                <td>
                    Card
                </td>
                <td>
                    Active
                </td>
                <td>
                    Primary
                </td>
            </tr>
            <tr v-for="pm in payment_methods" :key="pm._id" 
                :class="[pm.billing_account.active?'active-card':'inactive-card',pm.primary?'primary-card':'']"

            >
                <td>
                    {{ pm.billing_account.name }}
                </td>
                <td>
                    {{ pm.billing_account.active }}
                </td>
                <td>
                    {{pm.primary}}
                </td>
            </tr>
        </table>
        <NewPaymentMethod v-if="showPaymentMethodDialog" @updateParent="finishedAddingPaymentMethod" />
    </div>
</template>
<script>
import NewPaymentMethod from './NewPaymentMethod.vue'
import axios from 'axios'

export default {
    name:"AccountPayment",
    components:{
        NewPaymentMethod
    },
    data(){
        return {
            showPaymentMethodDialog:false,
            payment_methods:[]
        }
    },
    mounted(){
        this.loadPaymentMethods()
    },
    methods:{
        addNewPaymentMethod(){
            this.showPaymentMethodDialog = true
        },
        loadPaymentMethods(){
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getUserAccountPaymentMethods",
                method:'get'
            }).then((res)=>{
                // console.log(res)
                this.payment_methods = res.data.payment_methods
            })
        },
        finishedAddingPaymentMethod(data){
            // console.log(data)
            this.payment_methods = data
            this.showPaymentMethodDialog = false
        }
    }
}
</script>
<style scoped>
* {
    font-size:0.7rem;
}
table tr:first-child {
    font-weight: bold;
}
table tr td:nth-child(1){
    width:20rem;
}
tr.active-card{
    background-color: rgba(38, 255, 67, 0.6);
}
tr.inactive-card{
    background-color: rgba(255, 36, 36, 0.6);
}
tr.primary-card{
    font-weight: bold;
}
button {
    cursor: pointer;
}
</style>