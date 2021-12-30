<template>
<div class="rv-listing relative">
    <div>
    <div class="font-bold">RV Settings</div>
    <div
      v-if="!expanded"
      @click="expanded = true"
      class="min-max-button clickable"
    >
      <img src="/static/arrow-down-icon.png" class="icon" />
    </div>
    <div
      v-if="expanded"
      @click="expanded = false"
      class="min-max-button clickable"
    >
      <img v-if="expanded" src="/static/arrow-up-icon.png" class="icon" />
    </div>
    </div>
    <div v-if="expanded">
    <div v-if="!edit_is_active">
    <select name="" id="" class="rv-selector" v-model="selected_rv" @change="setSelectedRV">
        <option v-for="rv in $store.state.rvs" :key="rv._id" :value="rv._id">{{rv.name}}</option>
    </select>
    <div class="w-full text-left">
        <strong>Details:</strong>
        <table>
            <tr>
                <td>Length:</td>
                <td>{{$store.state.activeRV.length.feet}}'{{$store.state.activeRV.length.inch}}"</td>
            </tr>
            <tr>
                <td>Width:</td>
                <td>{{$store.state.activeRV.width.feet}}'{{$store.state.activeRV.width.inch}}"</td>
            </tr>
            <tr>
                <td>Height:</td>
                <td>{{$store.state.activeRV.height.feet}}'{{$store.state.activeRV.height.inch}}"</td>
            </tr>
            <tr>
                <td>Weight:</td>
                <td>{{$store.state.activeRV.weight}} Lbs</td>
            </tr>
            <tr>
                <td>Type:</td>
                <td>{{getRVType($store.state.activeRV.rvtype)}}</td>
            </tr>
            <tr>
                <td>Fuel</td>
                <td>{{getFuelType($store.state.activeRV.fueltype)}}</td>
            </tr>
            <tr>
                <td>Max Speed</td>
                <td>{{$store.state.activeRV.maxspeed}}</td>
            </tr>
        </table>
    </div>
    <div class="mt-2 w-full text-center">
        <button @click="editRV">Edit RV</button>
        <button @click="$emit('add_new')">Add New RV</button>
    </div>
    </div>
    </div>
    </div>
</template>
<script>
export default{
    name:'RVListing',
    props:{
        edit_active:{
            type:Boolean,
            required:true
        }
    },
    data(){
        return {
            selected_rv:"",
            edit_is_active:false,
            expanded:false
        }
    },
    methods:{
        getRVType(t){
            switch(t){
                case 'motorhome':return "Motorhome"
                case '5thwheel':return "5th Wheel"
                case 'traveltrailer':return "Travel Trailer"
                default:
                    return t
            }
        },
        getFuelType(t){
            switch(t){
                case 'regular':return "Regular"
                case 'midgrade':return "Midgrade"
                case 'premium':return "Premium"
                case 'diesel':return "Diesel"
                default: return t
            }
        },
        setSelectedRV(){
            this.$store.dispatch("setActiveRV",this.selected_rv)
            this.$store.commit("resetSearchPredefined")
        },
        editRV(){
            this.$emit("edit_active_rv")
        }
    },
    mounted(){
        if (this.$store.state.activeRV != null){
            this.selected_rv = this.$store.state.activeRV._id
        }
    },
    watch:{
        'this.$store.state.activeRV':function(){
            this.selected_rv = this.$store.state.activeRV._id
        },
        edit_active(){
            this.edit_is_active = this.edit_active
        }
    }
}
</script>
<style scoped>
.rv-listing{
    font-size:0.75rem;
    text-align: left;
    border:solid rgb(80,80,80) 1px;
    border-radius: 0.25rem;
    margin-left:0.1rem;
    margin-right:0.1rem;
    width:97%;
    padding-left:0.1rem;
    padding-bottom:0.1rem;
}
select{
    font-size:0.65rem;
    margin-left:0.1rem;
    margin-right:0.1rem;
}
button{
    font-size:0.6rem;
    margin-right:0.1rem;
}
.rv-selector{
    max-width:98%;
    min-width:90%;
}
</style>