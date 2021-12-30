<template>
    <div>
    <input type="text"
           v-if="edit"
           :value="valueLocal"
           @blur="valueLocal = $event.target.value; edit = false; $emit('input', this.value,valueLocal,this.identifier);"
           @keyup.enter="valueLocal = $event.target.value; edit = false; $emit('input', this.value, valueLocal,this.identifier);"
             />
        <div v-else @click="edit = true;">
          {{valueLocal}} 
          
        </div>
    </div>
</template>
<script>
export default {
    name:'ClickToEdit',
    props:['value','identifier'],
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
</style>