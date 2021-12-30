<template>

    <div class="w-full archived-routes">
        <div>{{route.name}}</div>
        <Popper :interactive="false" :hover="true">
        <button @click="restoreRoute(route._id)">
            Restore
        </button>
        <template #content>
        <div class="tooltip-popup">This will restore the route, so that you can modify it again</div>
      </template>
        </Popper>
        <Popper :interactive="false" :hover="true">
        <button
      
      @click="removeRoute(route._id)"
    >
      Remove
    </button>
    <template #content>
        <div class="tooltip-popup">This will delete the route permanently</div>
      </template>
        </Popper>
    </div>

</template>
<script>
import Popper from 'vue3-popper'

export default{
    name:"ArchivedRoutes",
    components:{
        Popper
    },
    props:{
        route_prop:{
            type:Object,
            required:true
        }
    },
    data(){
        return{
            route:this.route_prop
        }
    },
    watch:{
        route_prop:function(){
            this.route = this.route_prop
        }
    },
    methods:{
        restoreRoute(id){
            this.$store.dispatch("restoreRoute",id)
        },
        removeRoute(id){
      
        this.$store.dispatch("removeRoute",id);
      
    },
    }
}
</script>
<style scoped>
.archived-routes{
    font-size:0.7rem;
    display:flex;
    flex-direction: row;
}
button{
    font-size:0.55rem;
    margin-right:0.1rem;
    margin-left:0.1rem;
}
</style>