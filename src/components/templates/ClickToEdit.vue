<template>
    <div>
    <input type="text"
           v-if="edit"
           :value="valueLocal"
           @blur="valueLocal = $event.target.value; edit = false; $emit('input', this.value,valueLocal,this.identifier);"
           @keyup.enter="valueLocal = $event.target.value; edit = false; $emit('input', this.value, valueLocal,this.identifier);"
             />
        <div v-else @click="edit = true;" class="title-text">
          <div>{{valueLocal}}</div><div v-if="isSystemRoute">SYSTEM</div>
          
        </div>
    </div>
</template>
<script>
export default {
    name:'ClickToEdit',
    props:['value','identifier','isSystemRoute'],
    data(){
        return {
            edit:false,
            valueLocal:this.value
        }
    },
    watch: {
        value: function() {
            this.valueLocal = this.value
        }
    }
}
</script>
<style scoped>
div {
    font-size: 0.8rem;
}
div.title-text{
    display:flex;
    flex-direction: row;
}
div.title-text div:nth-child(1){
    margin-left:0.5rem;
}
div.title-text div:nth-child(2){
    position:absolute;
     right:0.5rem;
}
</style>