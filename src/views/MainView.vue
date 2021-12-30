<template>
    <ModalPopup v-if="$store.state.showRouteDirections" 
                :rightTopCloseOption="true" 
                @close="$store.commit('setShowRouteDirections',!$store.state.showRouteDirections)"
                dialogTitle="Route Summary"
    >
        <RouteDirections />
    </ModalPopup>
    <ModalPopup v-if="$store.state.showAbout" :rightTopCloseOption="true" @close="$store.commit('setShowAbout',!$store.state.showAbout)">
        <AboutPage />
    </ModalPopup>
    <ModalPopup v-if="$store.state.showRouteTolls" :rightTopCloseOption="true" @close="$store.commit('setShowRouteTolls',!$store.state.showRouteTolls)">
       <RouteTolls />
    </ModalPopup>
    <ModalPopup v-if="$store.state.routeCalculateInProcess">
        <div>Route Calculation In Process. Please Wait</div>
    </ModalPopup>
    <ModalPopup v-if="$store.state.showPicture!=null" :rightTopCloseOption="true" @close="$store.commit('clearShowPicture')">
        <div>{{$store.state.showPicture.title}}</div>
        <img :src="$store.state.showPicture.url" />
    </ModalPopup>
    <ModalPopup v-if="$store.state.accountMaintenanceActive">
        <AccountMain />
    </ModalPopup>
    <ModalPopup v-if="$store.state.editStopDateActive">
        <EditRouteStopDate />
    </ModalPopup>
    <Header />
    <div class="main_window">
    <LeftToolbar/>
    <MapView class="z-0" id="main_map_view_123" :map_width="map_width" :map_height="map_height"/>
    <RightToolbar/>
    </div>
</template>
<script>
import Header from '../components/toolbars/Header.vue'
import LeftToolbar from '../components/toolbars/LeftToolbar.vue'
import MapView from '../components/map/MapView.vue'
import RightToolbar from '../components/toolbars/RightToolbar.vue'
import ModalPopup from '../components/templates/ModalPopup.vue'
import RouteDirections from '../components/route/RouteDirections.vue'
import AboutPage from '../components/other/AboutPage.vue'
import RouteTolls from '../components/route/RouteTolls.vue'
import AccountMain from '../components/account/AccountMain.vue'
import EditRouteStopDate from '../components/route/EditRouteStopDate.vue'

export default {
    name:'MainView',
    components:{
        Header,
        LeftToolbar,
        MapView,
        RightToolbar,
        ModalPopup,
        RouteDirections,
        AboutPage,
        RouteTolls,
        AccountMain,
        EditRouteStopDate
    },
    data(){
        return {
            map_width:800,
            map_height:600
        }
    },
    mounted(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.map_width = (w - 445)
        this.map_height = (h-33)
        document.getElementById("main_map_view_123").style.width = (w - 445) + "px";
        document.getElementById("main_map_view_123").style.height = (h) + "px";
    }
}
</script>