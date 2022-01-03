<template>
        <div class="grid grid-cols-5 w-144 h-144">
            <div class="flex flex-col text-left col-span-1">
                <ul class="list-none">
                <li class="cursor-pointer">General</li>
                <li class="cursor-pointer">Payment</li>
                <li><button @click="logoutUser">Logout</button></li>
                </ul>
            </div>
            <div class="col-span-3 text-left">
                <AccountGeneral v-if="accountScreen=='general'" />
            </div>
            <div class="col-span-1">
                <button 
                    @click="$store.commit('setShowAccountMaintenance',!$store.state.accountMaintenanceActive)"
                    class="shadow-md pl-3 pr-3"
                >Close</button>
            </div>
        </div>
</template>
<script>
import AccountGeneral from './AccountGeneral.vue'

export default{
    name:"AccountMain",
    data(){
        return {
            accountScreen:"general"
        }
    },
    components:{
        AccountGeneral
    },
    methods:{
        logoutUser(){
            this.$store.dispatch("logoutUser")
        }
    }
}
</script>