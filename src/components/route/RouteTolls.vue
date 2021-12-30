<template>
    <div class="route-tolls">
        <div class="font-bold">Toll Overview</div>
        <div v-for="section in $store.state.activeRoute.tolls" :key="section.id">
            <div v-for="toll in section" :key="toll.id" class="text-left">
                {{toll.tollSystem}}
                <div v-for="fare in toll.fares" :key="fare.id" class="w-full grid">
                    <div class="float-left">{{formatPaymentMethod(fare.paymentMethods[0])}}</div>
                    <div class="float-right">{{formatPrice(fare.price.value)}}</div>
                </div>
            </div>
        </div>
        <div>
        <input type="checkbox" id="PreventToll" value="true" v-model="preventTollroads" />
        <label for="PreventToll">Prevent Tollroads</label>
        </div>
    </div>
</template>
<script>
export default{
    name:"RouteTolls",
    data(){
        return {
            preventTollroads:false
        }
    },
    mounted(){
        this.preventTollroads = this.$store.state.preventTollroads
    },
    watch:{
        preventTollroads:function(){
            this.$store.commit("setPreventTollroads",this.preventTollroads)
        }
    },
    methods:{
        formatPrice(val){
            return "$" + val.toFixed(2)
        },
        formatPaymentMethod(m){
            const words = m.split(" ");

            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }

            return words.join(" ");

        }
    }
}
</script>
<style scoped>
.route-tolls{
    font-size:0.65rem;
    margin-top:0.2rem;
}
.grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.grid > div:first-child{
    text-align: left;
}
.grid > div:last-child{
    text-align: right;
}
</style>