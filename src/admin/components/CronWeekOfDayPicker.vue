<template>
    <div>
        <check-box v-for="day in daysOfWeek" :key="day.id" :fieldId="day.id" v-model:names="names" :value="day.title" />
        <!-- <label v-for="day in daysOfWeek" :key="day.id">
            <input type="checkbox" :value="day.id">
            <span>{{day.title}}</span>
        </label> -->
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import AdminCheckbox from './AdminCheckbox.vue'

export default{
    name:"CronWeekOfDayPicker",
    components:{
        "check-box":AdminCheckbox
    },
    setup(){
        const names = ref([])
        return {
            names
        }
    },
    data(){
        return {
            daysOfWeek:[
                {id:"0",title:"Sunday"},
                {id:"1",title:"Monday"},
                {id:"2",title:"Tuesday"},
                {id:"3",title:"Wednesday"},
                {id:"4",title:"Thursday"},
                {id:"5",title:"Friday"},
                {id:"6",title:"Saturday"}
            ]
        }
    },
    watch:{
        names:function(newVal, oldVal){
            this.$emit("updated",newVal)
            // console.log(newVal)
        }
    }
}
</script>
<style scoped>
div{
    display: inline-flex;
}
</style>