<template>
    <div v-if="dataAvailable && businessData != null">
        <div>Rating: <StarRating :inline="true" :star-size="10" :increment="0.5" :read-only="true" :rating="businessData.rating"></StarRating></div>
        <div><a :href="businessData.url" target="_yelp_page">Reviews: {{businessData.review_count}}</a></div>
        <img v-for="photo in businessData.photos" 
            :key="photo.id" 
            :src="photo" 
            class="yelp-review-image" 
            @click="$store.commit('setShowPicture',{title:businessData.name,url:photo})"
        />
    </div>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default{
    name:"YelpReviews",
    props:["id"],
    components:{
        StarRating
    },
    data(){
        return {
            dataAvailable:false,
            businessData:null
        }
    },
    mounted(){
        //console.log(this.id)
        axios({
            method:'post',
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getYelpBusinessReviews",
            data:{
                id:this.id
            }
        }).then((res)=>{
            //console.log(res.data)
            this.businessData = res.data.data
            this.dataAvailable = true
        })
    }
}
</script>
<style scoped>
img.yelp-review-image{
    max-width:95%;
    max-height:9rem;
    margin-left:0.15rem;
    border-radius: 0.25rem;
}
</style>