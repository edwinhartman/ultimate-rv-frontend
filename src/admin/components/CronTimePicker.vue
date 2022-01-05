<template>
    <div class="oye-timepicker">
    <div>
      <select name="" id="" v-model="hours" @change="updateParent">
        <option v-for="n in availableHours " :key="n" >{{n}}</option>
      </select>
    </div>
    <div>:</div>
    <div>
      <select name="" id="" v-model="minutes" @change="updateParent">
        <option v-for="n in availableMinutes " :key="n" >{{n}}</option>
      </select>
    </div>
  </div>
</template>
<script>
export default {
    name:"CronTimePicker",
    data(){
        return {
            availableMinutes:[],
            availableHours:[],
            hours:"0",
            minutes:"0"
        }
    },
    created(){
        for (let i=0;i<60;i++){
            this.availableMinutes.push(i)
        }
        for (let i=0;i<24;i++){
            this.availableHours.push(i)
        }
    },
    methods:{
        updateParent(){
            this.$emit("updated",{hours:this.hours,minutes:this.minutes})
        }
    }
}
</script>
<style scoped>
.oye-timepicker {
  display: inline-block;

}
.oye-timepicker > div {
    display:inline-flex;
}
select{
    font-size:0.6rem;
}
</style>