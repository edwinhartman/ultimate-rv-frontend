<template>
    <div class="text-sm font-bold mt-3 text-left">RV Settings</div>
    <NewRV @close_panel="$emit('close_panel')" :edit_rv="editRV" />
</template>
<script>
import NewRV from './NewRV.vue'
export default{
    name:'RVSettings',
    props:{
        edit_rv:{
            type:Object,
            required:false
        }
        
    },
    emits:["close_panel"],
    computed:{
        editRV(){
            return this.edit_rv
        }
    },
    components:{
        NewRV
    }
}
</script>
