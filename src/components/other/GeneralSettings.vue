<template>
    <div class="general-settings relative">
        <div class="w-full">
        <div class="font-bold clickable" @click="expanded=!expanded">General Settings</div>
        <div
      v-if="!expanded"
      @click="expanded = true"
      class="min-max-button clickable"
    >
      <img src="/static/arrow-down-icon.png" class="icon" />
    </div>
        </div>
        
    <div
      v-if="expanded"
      @click="expanded = false"
      class="min-max-button"
    >
      <img v-if="expanded" src="/static/arrow-up-icon.png" class="icon" />
    </div>
        <div v-if="expanded" class="text-left w-full">
        <ul class="list-none mb-1">
        <li>
        <input type="checkbox" id="PreventToll" value="true" v-model="preventTollroads" />
        <label for="PreventToll">Prevent Tollroads</label>
        </li>
        <li>
        <input type="checkbox" id="AlwaysShowRouteSummary" value="true" v-model="alwaysShowRouteSummary" />
        <label for="AlwaysShowRouteSummary">Always Show Route Summary</label>
        </li>
        <li>
        <input type="checkbox" id="ShowYelpDetails" value="true" v-model="showYelpDetails" />
        <label for="ShowYelpDetails">Show Yelp Details</label>
        </li>
        <li>
            Default Origin: <select name="" id="" v-model="defaultOriginType">
                <option value="current">Current Location</option>
                <option value="home">Home Location</option>
            </select>
        </li>
        <li v-if="defaultOriginType=='home'">
            Home Address: <input type="text">
        </li>
        </ul>
        </div>
    </div>
</template>
<script>
export default{
    name:"GeneralSettings",
    data(){
        return {
            preventTollroads:false,
            alwaysShowRouteSummary:false,
            expanded:false,
            showYelpDetails:false,
            defaultOriginType:"current"
        }
    },
    mounted(){
        this.preventTollroads = this.$store.state.preventTollroads
        this.alwaysShowRouteSummary = this.$store.state.alwaysShowRouteSummary
        this.showYelpDetails = this.$store.state.showYelpDetails
        this.defaultOriginType = this.$store.state.defaultOriginType
    },
    watch:{
        preventTollroads:function(){
            this.$store.commit("setPreventTollroads",this.preventTollroads)
        },
        "$store.state.preventTollroads":function(){
            this.preventTollroads = this.$store.state.preventTollroads
        },
        alwaysShowRouteSummary:function(){
            this.$store.commit("setAlwaysShowRouteSummary",this.alwaysShowRouteSummary)
        },
        showYelpDetails:function(){
            this.$store.commit("setShowYelpDetails",this.showYelpDetails)
        },
        defaultOriginType:function(){
            this.$store.commit("setDefaultOriginType",this.defaultOriginType)
        }
    }
}
</script>
<style scoped>
.general-settings{
    width:97%;
    font-size: 0.75rem;
    border:solid rgb(80,80,80) 1px;
    border-radius: 0.25rem;
    margin-left:0.1rem;
    margin-right:0.1rem;
    margin-bottom:0.1rem;
    text-align: left;
    padding-left:0.1rem;
    padding-bottom:0.1rem;
}
select,input{
    font-size:0.65rem;
}
</style>