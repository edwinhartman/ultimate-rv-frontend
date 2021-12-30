<template>
    <div>
        <DropDownListNumbers :start="minFeet" :end="maxFeet" :selectedVal="dimension_prop.feet" @changed="setFt" />
        <DropDownListNumbers v-model="dimension.inch" start="0" end="11" :selectedVal="dimension_prop.inch" @changed="setInch" />
    </div>
</template>
<script>
import DropDownListNumbers from './DropDownListNumbers.vue'
export default{
    name:"DimensionFtInch",
    props:{
        minFt:{
            type:Number,
            required:true
        },
        maxFt:{
            type:Number,
            required:true
        },
        dimension_prop:{
            type:Object,
            required:true
        }
    },
    data(){
        return {
            maxFeet:parseInt(this.maxFt),
            minFeet:parseInt(this.minFt),
            dimension:this.dimension_prop
        }
    },
    watch:{
        dimension_prop:function(){
            this.dimension = this.dimension_prop
        }
    },
    components:{
        DropDownListNumbers
    },
    methods:{
        setFt(val){
            this.dimension.feet = parseInt(val)
        },
        setInch(val){
            this.dimension.inch = parseInt(val)
        }
    }
}
</script>