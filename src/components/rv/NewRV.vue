<template>
    <div class="w-full border border-gray-800 rounded-md p-1 text-tiny text-left">
    <table>
        <tr><td>Name</td><td><input type="text" v-model="name" style="width:120px;"></td></tr>
        <tr><td>Length</td><td><DimensionFtInch :dimension_prop="length" :minFt="20" :maxFt="50" /></td></tr>
        <tr><td>Width</td><td><DimensionFtInch :dimension_prop="width" :minFt="6" :maxFt="10" /></td></tr>
        <tr><td>Height</td><td><DimensionFtInch :dimension_prop="height" :minFt="6" :maxFt="15" /></td></tr>
        <tr><td>Weight</td><td><input type="text" v-model="weight" style="width:80px;"></td></tr>
        <tr><td>Type</td><td><select v-model="rvtype">
            <option value="motorhome">Motorhome</option>
            <option value="traveltrailer">Travel Trailer</option>
            <option value="5thwheel">5th Wheel</option>
        </select></td></tr>
        <tr>
            <td>Fuel Type</td>
            <td><select v-model="fuelType">
                <option value="regular">Regular</option>
                <option value="midgrade">Midgrade</option>
                <option value="premium">Premium</option>
                <option value="diesel">Diesel</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Max Speed</td>
            <td><input type="text" v-model="maxspeed" style="width:40px;"></td>
        </tr>
        <tr><td colspan="2" class="text-center pt-2">
            <button v-if="id==''" @click="addRV" class="bg-green-800 hover:bg-green-600 text-white pt-1 pb-0 pl-3 pr-3 ml-1 rounded-md shadow-md text-tiny">Add</button>
            <button v-if="id!=''" @click="saveRV" class="bg-green-800 hover:bg-green-600 text-white pt-1 pb-0 pl-3 pr-3 ml-1 rounded-md shadow-md text-tiny">Save</button>
            <button v-if="$store.state.rvs.length > 0" @click="cancel" class="bg-gray-800 hover:bg-gray-600 text-white pt-1 pb-0 pl-3 pr-3 ml-1 rounded-md shadow-md text-tiny">Cancel</button>
        </td></tr>
    </table>
    </div>
</template>
<script>
import DimensionFtInch from './DimensionFtInch.vue'

export default{
    name:"NewRV",
    data(){
        return {
            id:"",
            name:"",
            length:{
                feet:-1,
                inch:0
            },
            width:{
                feet:-1,
                inch:0
            },
            height:{
                feet:-1,
                inch:0
            },
            weight:0,
            rvtype:"",
            fuelType:"",
            maxspeed:0
        }
    },
    props:{
        edit_rv:{
            type:Object,
            required:false
        }
    },
    components:{
        DimensionFtInch
    },
    watch:{
        edit_rv(new_value,old_value){
            console.log("edit_rv - new_value:",new_value)
        }
    },
    mounted(){
        console.log("mounted")
        if (this.edit_rv != null){
            this.name = this.edit_rv.name
            this.length = this.edit_rv.length
            this.width = this.edit_rv.width
            this.height = this.edit_rv.height
            this.weight = this.edit_rv.weight
            this.rvtype = this.edit_rv.rvtype
            this.fuelType = this.edit_rv.fueltype
            this.maxspeed = this.edit_rv.maxspeed
            this.id = this.edit_rv._id
        }
    },
    methods:{
        addRV(){
            
            this.$store.dispatch('addRV',{
                name:this.name,
                length:this.length,
                width:this.width,
                height:this.height,
                weight:this.weight,
                rvtype:this.rvtype,
                fueltype:this.fuelType,
                maxspeed:this.maxspeed
            })
            this.$emit("close_panel")
        },
        saveRV(){
            this.$store.dispatch('updateRV',{
                id:this.id,
                name:this.name,
                length:this.length,
                width:this.width,
                height:this.height,
                weight:this.weight,
                rvtype:this.rvtype,
                fueltype:this.fuelType,
                maxspeed:this.maxspeed
            })
            this.$emit("close_panel")
        },
        cancel(){
            this.$emit("close_panel")
        }
    }
}
</script>