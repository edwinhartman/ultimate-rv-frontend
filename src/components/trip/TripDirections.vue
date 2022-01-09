<template>
    <div class="overflow-scroll max-h-96 w-144 p-0 -mt-8 -mb-2 -mr-4 -ml-2" id="to_be_printed">
<button class="shadow-md rounded-md bg-gray-200 pl-1 pr-1 text-sm fixed ml-56 mt-2 " @click="print">Print</button>
        <div v-if="$store.state.activeTrip != null && $store.state.activeTrip.actions != null && $store.state.activeTrip.actions.length > 0" class="text-left">
            <div v-for="(section,idx) in $store.state.activeTrip.actions" :key="section._id" class="mb-2 print:mb-10">
                <div class="text-tiny font-bold italic">
                    {{$store.state.activeTrip.stops[idx].name}} to {{$store.state.activeTrip.stops[idx+1].name}} [{{ ($store.state.activeTrip.summary[idx].length / 1600).toFixed(0) }} miles]
                </div>
                <div v-for="action in section" :key="action._id" class="text-tiny">
                    <div v-if="action.severity != null || action.action=='arrive' || action.action=='depart'">
                        {{action.instruction}}
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>


export default {
    name:"TripDirections",
    methods:{
        print(){
           
            this.$htmlToPaper("to_be_printed",{"StyleSheetList":document.styleSheets})
        }
    }
}
</script>