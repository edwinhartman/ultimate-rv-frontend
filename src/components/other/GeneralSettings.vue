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
            <Popper :interactive="false" :hover="true">
                <div>
        <input type="checkbox" id="AutoPreventBigCities" value="true" v-model="autoPreventBigCities" />
        <label for="AutoPreventBigCities">Automatically Prevent Big Cities</label>
                </div>
        <template #content>
            <div class="tooltip-popup2">This will automatically bring in areas to avoid surrounding major cities when creating a new route</div>
          </template>
        </Popper>
        </li>
        <li>
            <input type="checkbox" id="ShowArchivedRoutes" value="true" v-model="showArchivedRoutes" />
        <label for="ShowArchivedRoutes">Show Archived Routes section</label>
        </li>
        <li v-if="$store.state.adminToken != null">
            <input type="checkbox" id="HideAdminFunctions" value="true" v-model="hideAdminFunctions" />
            <label for="HideAdminFunctions">Hide Admin Functions</label>
        </li>
        <li v-if="$store.state.adminToken != null && !$store.state.hideAdminFunctions">
            <input type="checkbox" id="ShowSystemRoutes" value="true" v-model="showSystemRoutes" />
            <label for="ShowSystemRoutes">Show System Routes section</label>
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
import Popper from "vue3-popper";
export default{
    name:"GeneralSettings",
    components:{
        Popper
    },
    data(){
        return {
            preventTollroads:false,
            alwaysShowRouteSummary:false,
            expanded:false,
            showYelpDetails:false,
            defaultOriginType:"current",
            autoPreventBigCities:false,
            showArchivedRoutes:false,
            showSystemRoutes:false,
            hideAdminFunctions:false
        }
    },
    mounted(){
        this.preventTollroads = this.$store.state.preventTollroads
        this.alwaysShowRouteSummary = this.$store.state.alwaysShowRouteSummary
        this.showYelpDetails = this.$store.state.showYelpDetails
        this.defaultOriginType = this.$store.state.defaultOriginType
        this.autoPreventBigCities = this.$store.state.autoPreventBigCities
        this.showArchivedRoutes = this.$store.state.showArchivedRoutes
        this.showSystemRoutes = this.$store.state.showSystemRoutes
        this.hideAdminFunctions = this.$store.state.hideAdminFunctions
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
        },
        autoPreventBigCities:function(){
            this.$store.commit("setAutoPreventBigCities",this.autoPreventBigCities)
        },
        showArchivedRoutes:function(){
            this.$store.commit("setShowArchivedRoutes",this.showArchivedRoutes)
        },
        showSystemRoutes:function(){
            this.$store.commit("setShowSystemRoutes",this.showSystemRoutes)
        },
        hideAdminFunctions:function(){
            this.$store.commit("setHideAdminFunctions",this.hideAdminFunctions)
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