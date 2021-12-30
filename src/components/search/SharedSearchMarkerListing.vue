<template>
    <div 
        v-if="$store.state.sharedSearchMarkers!= null && $store.state.sharedSearchMarkers.length > 0"
        class="w-full shared-search-marker-listing"
    >
        <div v-for="marker in $store.state.sharedSearchMarkers" :key="marker.id" class="shadow-right region" >
            <div class="font-bold clickable flex">
                <img v-if="marker.img!=null && marker.img != ''" :src="getImagePathName(marker.img)" class="icon" />
                <div @click="gotoLocation(marker.coordinate)">{{marker.title}}</div>
            </div>
            <div class="address">{{marker.address}}</div>
            <span v-html="marker.contents"></span>
            <MarkerAdditionalDetails v-if="$store.state.showYelpDetails" :location="marker.coordinate" :name="marker.title" />
        </div>
    </div>
</template>
<script>
import MarkerAdditionalDetails from './MarkerAdditionalDetails.vue'

export default{
    name:"SharedSearchMarkerListing",
    components:{
        MarkerAdditionalDetails
    },
    methods:{
        gotoLocation(coordinate){
            this.$store.commit("setNewMapRegion",{centerLat:coordinate.latitude,centerLon:coordinate.longitude,diffLat:0.25,diffLon:0.25})
            setTimeout(() => {
            let annotations =  window.mymapview.map.annotations
            for (let i=0;i<annotations.length;i++){
                if (annotations[i].coordinate.latitude == coordinate.latitude &&
                        annotations[i].coordinate.longitude == coordinate.longitude){
                            let a = annotations[i]
                            a.selected = true
                            break
                        }
            }
            },1500)
        },
        getImagePathName(img){
            return "/static/" + img
        }
    }
}
</script>
<style scoped>
.shared-search-marker-listing{
    text-align: left;
    font-size:0.7rem;
    padding-left:0.1rem;
    max-height:65vh;
    overflow-x: scroll;
}
.region{
    margin-left:0.1rem;
    margin-right:0.1rem;
    max-width:96%;
    margin-bottom:0.1rem;
    border-radius: 0.25rem;
    padding:0.1rem;

}
.address{
    font-size: 0.5rem;
}
.flex{
    display: flex;
    flex-direction: row;
}
span{
    font-size:0.6rem;
}
</style>