<template>
    <div>

    </div>
</template>
<script>
import axios from 'axios'

export default {
    name:"AccountPlan",
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/account/getUserAccountPlanInfo",
            method:'get'
        }).then((res)=>{
            console.log(res)
        })
    }
}
</script>