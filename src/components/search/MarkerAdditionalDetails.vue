<template>
    <div v-if="dataAvailable" class="marker-additional-details">
        <div v-if="businessData.display_phone!=''" class="text-tiny">Phone: {{businessData.display_phone}}</div>
        
        <YelpReviews v-if="dataAvailable" :id="businessData.id" />
    </div>
</template>
<script>
import axios from 'axios'
import YelpReviews from './YelpReviews.vue'

export default {
    name:"MarkerAdditionalDetails",
    props:['location','name'],
    components:{
        YelpReviews
    },
    data(){
        return {
            dataAvailable:false,
            businessData:null
        }
    },
    watch:{
        location(){
            this.getData()
        },
        name(){
            this.getData()
        }
    },
    mounted(){
        //console.log(this.location)
       this.getData()
    },
    methods:{
        getData(){
            this.dataAvailable = false
             axios({
            method:'post',
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getYelpBusiness",
            data:{
                location:{
                    latitude:this.location.latitude,
                    longitude:this.location.longitude
                },
                name:this.name
            }
        }).then((res)=>{
            // console.log(res.data)
            if (res.data.data != null){
                this.businessData = res.data.data
                this.dataAvailable = true
            }else{
                this.dataAvailable = false
                this.businessData = null
            }
        })
        }
    }
}
</script>
<style scoped>
.marker-additional-details{
    font-size:0.6rem;
}
</style>