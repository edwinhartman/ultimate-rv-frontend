<template>
    <div class="annotations-detail" v-if="annotation!=null">
        <h1 class="font-bold">{{annotation.title}}</h1>
        <h2>{{annotation.subtitle}}</h2>
        <MarkerAdditionalDetails v-if="$store.state.showYelpDetails" :location="annotation.coordinate" :name="annotation.title" />
    </div>
</template>
<script>
import MarkerAdditionalDetails from './MarkerAdditionalDetails.vue'

export default{
    name:"AnnotationDetails",
    components:{
        MarkerAdditionalDetails
    },
    data(){
        return{
            annotation:null
        }
    },
    watch:{
        "$store.state.showAnnotationDetailsAvailable":{
            immediate:true,
            handler(){
                if (this.$store.state.showAnnotationDetailsAvailable){
                this.annotation = this.$store.state.showAnnotationDetails
                }else{
                    this.annotation = null
                }
            }
        }
    }
}
</script>
<style scoped>
.annotations-detail {
    display:flex;
    flex-direction: column;
    text-align: left;
    margin-bottom:0.2rem;
    border:solid rgb(80,80,80) 1px;
    border-radius: 0.25rem;
    margin-left:0.1rem;
    margin-right:0.1rem;
    padding-left:0.1rem;
    padding-right:0.1rem;
}
h1 {
    font-size:0.9rem;
    margin-top:0.1rem;
    margin-bottom:0.1rem;
}
h2 {
    font-size:0.55rem;
    margin-top:0.1rem;
    margin-bottom:0.1rem;
}
</style>