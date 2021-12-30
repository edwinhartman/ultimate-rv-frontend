<template>
    <select name="" id="" @change="$emit('changed', $event.target.value)" v-model="this.selValue">
        <option v-for="index in endValue" :key="index" >{{index}}</option>
    </select>
</template>
<script>
export default{
    name:"DropDownListNumbers",
    props:['start','end','selectedVal'],
    data(){
        return {
            selValue:-1
        }
    },
    watch:{
        selectedVal:function(){
            this.selValue = this.selectedVal
        }
    },
    mounted(){
        if (Number(this.selectedVal) < 0){
            this.selValue = Number(this.start)
        }else{
            this.selValue = Number(this.selectedVal)
        }
    },
    computed:{
        endValue(){
            let s = parseInt(this.start)
            let e = parseInt(this.end)
            let arr = []
            for (var i=s;i<=e;i++){
                arr.push(i)
            }
            return arr
        }
    }
}
</script>