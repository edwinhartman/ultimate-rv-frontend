<template>
    <div v-if="plan != null" class="main">
        <div>Plan: {{ plan.name }}</div>
        <div>Description: {{ plan.description }}</div>
        <div>Price: {{ formatAmount(plan.price) }}</div>
        <div>Next Renewal: {{ getDateTimeFormatted(renewal) }}</div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name:"AccountPlan",
    data(){
        return {
            plan:null,
            renewal:""
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/getUserAccountPlanInfo",
            method:'get'
        }).then((res)=>{
            // console.log(res)
            this.plan = res.data.plan
            this.renewal = res.data.renewal
        })
    }
}
</script>
<style scoped>
div.main{
    display: flex;
    flex-direction: column;
}
</style>