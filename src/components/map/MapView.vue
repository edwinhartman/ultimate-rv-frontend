<template>
  <div>
    <ModalPopup :yesNoOption="true" v-if="showRemoveAvoidAreaPopup" @yesAnswer="removeAvoidArea(true)" @noAnswer="removeAvoidArea(false)">
      <div>You are about to remove an avoid area. Are you sure?</div>
    </ModalPopup>
    <RouteSummary2 />
    <SearchAlongRoute />
    <div
      id="map"
      v-bind:style="{ width: map_width + 'px', height: map_height + 'px' }"
      class="z-0"
    ></div>
  
  </div>
</template>
<script>
import { reactive } from "vue";
import axios from "axios";
import { searchGasStations } from "../../business_logic/GasStations";
import { searchDumpStations } from "../../business_logic/DumpStation";
import { getNationalParks } from "../../business_logic/NationalPark";
import { getStateParks } from "../../business_logic/StateParks";
import { getCOEParks } from "../../business_logic/COEParks";
import { getCampgrounds } from "../../business_logic/Campgrounds";
import { getOvernightParking } from "../../business_logic/OvernightParking";

import ModalPopup from "../templates/ModalPopup.vue";
import RouteSummary2 from '../route/RouteSummary2.vue'
import SearchAlongRoute from '../route/SearchAlongRoute.vue'
import {toRad,toDeg} from '../../business_logic/HelperLogic'

export default {
  name: "MapView",
  props: {
    map_width: {
      type: Number,
      required: true,
    },
    map_height: {
      type: Number,
      required: true,
    },
  },
  components: {
    ModalPopup,
    RouteSummary2,
    SearchAlongRoute
  },
  data() {
    return {
      currentLocation: null,
      stopMarkers: [],
      predefinedSearchMarkers: [],
      center: null,
      avoidStarted: false,
      avoidRectStart: null,
      maploaded:false,
      markedAreas:[],
      showRemoveAvoidAreaPopup:false,
      areaToBeRemoved:null
    };
  },
  created() {
    let appleMapKitScript = document.createElement("script");
    let self = this;
    appleMapKitScript.onload = () => {
      const tokenID =
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZKRkI0Vlo0VUMifQ.eyJpc3MiOiI5MjJQUzc4S0pLIiwiaWF0IjoxNjM2OTk5OTk4LCJleHAiOjE2Njg0NzA0MDB9.geDTQF2SnneWBGy2vaE2EEQNqTbT4eM79imDhiLmF5ESaBRBjXaevvc6Z6_palG4hhYdtY0gtGH1ecgvCfrtiw";

      mapkit.init({
        authorizationCallback: function (done) {
          done(tokenID);
          window.mymapview.maploaded = true
        },
      });

      if (!("geolocation" in navigator)) {
        this.errorStr = "Geolocation is not available.";
        return;
      }

      navigator.geolocation.getCurrentPosition(function (position) {
        var mylat = position.coords.latitude;
        var mylng = position.coords.longitude;

        window.mymapview.currentLocation = position.coords;

        var region = new mapkit.CoordinateRegion(
          new mapkit.Coordinate(mylat, mylng),
          new mapkit.CoordinateSpan(5, 5)
        );

        self.map = new mapkit.Map("map", {
          region: region,
          showsCompass: mapkit.FeatureVisibility.Hidden,
          showsZoomControl: true,
          showsMapTypeControl: true,
          showsUserLocation: true,
          tracksUserLocation: true,
          showsUserLocationControl: true,
        });

        self.map.addEventListener("region-change-end", function () {
          window.mymapview.regionChanged();
        });
        self.map.addEventListener("long-press", function (evt) {
          window.mymapview.longPress(evt);
        });
        self.map.addEventListener('select', function(event) {
          // console.log(event.annotation)
          if (event.overlay){
            window.mymapview.removeAvoidRegion(event.overlay.points)
          }
          if (event.annotation){
            window.mymapview.showAnnotationDetails(event.annotation)
          }
        });
        self.map.addEventListener("deselect",function(event){
          for (let i=0;i<self.map.overlays.length;i++){
            self.map.overlays[i].selected = false
          }
          window.mymapview.removeAnnotationDetails()
        })
        window.mymapview.reloadData();
      });
    };
    appleMapKitScript.setAttribute(
      "src",
      "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js"
    );
    document.head.appendChild(appleMapKitScript);
  },
  mounted() {
    window.mymapview = this;
  },

  computed: {
    keywords() {
      return this.$store.state.searchKeywords;
    },
    polyline() {
      if (
        this.$store.state.activeRoute != null &&
        this.$store.state.activeRoute.polyline != null
      ) {
        // if (this.$store.state.activeRoute.polyline != null){
        //     return this.$store.state.activeRoute.polyline
        // }
        return this.$store.state.activeRoute.polyline.length;
      }
      return null;
    },
    stops() {
      if (
        this.$store.state.activeRoute != null &&
        this.$store.state.activeRoute.stops != null
      ) {
        return this.$store.state.activeRoute.stops.length;
      }
      return null;
    },
    areasToAvoid(){
      if (this.$store.state.activeRoute != null &&
        this.$store.state.activeRoute.areasToAvoid != null){
          return this.$store.state.activeRoute.areasToAvoid.length
        }
        return null;
    }
  },
  watch: {
    keywords(newValue, oldValue) {
      this.removeAnnotationFromList(this.stopMarkers);
      this.stopMarkers = [];
      var search = new mapkit.Search({
        language: "en-GB",
        //getsUserLocation: true,
        region: map.region,
        includeAddresses: true,
        includePointsOfInterest: true,
        includeQueries: true,
      });
      search.search(newValue, (error, data) => {
        for (let i = 0; i < data.places.length; i++) {
          var calloutDelegate = {
            calloutElementForAnnotation: function (annotation) {
              var element = document.createElement("div");
              element.className = "annotation-detail";
              var title = element.appendChild(document.createElement("h3"));
              title.textContent = annotation.title;

              if (data.places[i].urls.length > 0) {
                var link = element.appendChild(document.createElement("a"));
                link.className = "text-tiny"
                link.target = "_blank";
                link.href = data.places[i].urls[0];
                link.textContent = "Open Website";
                element.appendChild(document.createElement("br"));
              }

              var btn = element.appendChild(document.createElement("button"));
              btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
              btn.textContent = "Add To Route";
              btn.onclick = function () {
                window.mymapview.addToRoute(data.places[i]);
                //this.parentNode.style.display = 'none';
              };

              return element;
            },
          };
          const annotation = new mapkit.MarkerAnnotation(
            data.places[i].coordinate,
            {
              title: data.places[i].name,
              subtitle: data.places[i].formattedAddress,
              glyphText: "",
              color: "#8e8e93",
              displayPriority: 1000,
              //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
              callout: calloutDelegate,
            }
          );
          this.map.addAnnotation(annotation);
        }
        //console.log(data)
      });
    },
    polyline(newValue, oldValue) {
      if (newValue != null && this.map != null) {
        if (newValue > 0) {
          this.loadPolyline()
        } else {
          if (this.map != null && this.map.overlays != null) {
            this.map.removeOverlays(this.map.overlays);
          }
        }
      }
    },
    stops(newValue, oldValue) {
      this.loadStops();
      
    },
    areasToAvoid(newValue,oldValue){
      this.loadAreasToAvoid()
    },
    "$store.state.activeRoute": function (newValue,oldValue) {
      
      if (this.map != null && this.map.overlays != null && newValue == null){
        this.map.removeOverlays(this.map.overlays)
        this.map.removeAnnotations(this.map.annotations)

      }
      this.loadStops();
      this.loadPolyline();
    },
    "$store.state.currentLocation": function () {
      this.loadStops();
      this.loadAreasToAvoid();
    },
    "$store.state.mapRegion": function () {
      //console.log("map region changed")
      let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(
          this.$store.state.mapRegion.center.latitude,
          this.$store.state.mapRegion.center.longitude
        ),
        new mapkit.CoordinateSpan(
          this.$store.state.mapRegion.span.latitudeSpan,
          this.$store.state.mapRegion.span.longitudeSpan
        )
      );
      this.map.setRegionAnimated(region, true);
    },
    "$store.state.searchPredefined": function () {
      //console.log("searchPredefined changed");
      this.removeAnnotationFromList(this.predefinedSearchMarkers);
      this.$store.commit('clearSharedSearchMarkers')
      this.predefinedSearchMarkers = [];
      if (this.map != null) {
        let latitude = this.map.center.latitude;
        let longitude = this.map.center.longitude;

        var geocoder = new mapkit.Geocoder();
        geocoder.reverseLookup(
          new mapkit.Coordinate(latitude, longitude),
          (err, data) => {
            //console.log(data)
            if (err == null) {
              if (data != null && data.results.length > 0) {
                var city = data.results[0].locality;
                var state = data.results[0].administrativeAreaCode;
                var zip = data.results[0].postCode;
                var country = data.results[0].countryCode;
                if (this.$store.state.searchPredefined == "gasstations") {
                  searchGasStations(
                    this.map.region,
                    this.$store,
                    city,
                    state,
                    zip,
                    country,
                    (annotations,markers) => {
                      // console.log(annotations)
                      for (let i = 0; i < annotations.length; i++) {
                        this.predefinedSearchMarkers.push(
                          annotations[i].coordinate
                        );
                        
                        this.map.addAnnotation(annotations[i]);
                      }
                      this.$store.dispatch("setSharedSearchMarkers",markers)
                      this.center = this.map.region.center;
                    }
                  );
                }
                if (this.$store.state.searchPredefined == "dumpstations") {
                  this.getDumpStations(zip);
                }
                if (this.$store.state.searchPredefined == "nationalparks") {
                  this.getNationalParks();
                }
                if (this.$store.state.searchPredefined == "stateparks") {
                  this.getStateParks();
                }
                if (this.$store.state.searchPredefined == "coe_parks") {
                  this.getCOEParks();
                }
                if (this.$store.state.searchPredefined == "campgrounds") {
                  this.getCampgrounds();
                }
                if (this.$store.state.searchPredefined == "overnightparking"){
                  this.getOvernightParking()
                }
              }
            }
          }
        );
      }
    },
  },
  methods: {
    removeAnnotationFromList(list) {
      if (this.map != null && this.map.annotations != null) {
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.map.annotations.length; j++) {
            if (
              list[i].latitude == this.map.annotations[j].coordinate.latitude &&
              list[i].longitude == this.map.annotations[j].coordinate.longitude
            ) {
              this.map.removeAnnotation(this.map.annotations[j]);
              break;
            }
          }
        }
      }
    },
    loadPolyline(){
      if (this.map != null && this.map.overlays != null && 
          this.map.overlays.length > 0){
          for (let i=0;i<this.map.overlays.length;i++){
            //console.log(this.map.overlays[i].points.length)
            if (this.map.overlays[i].points.length > 1){
              this.map.removeOverlays([this.map.overlays[i]])
            }
          }
         
      }
      if (this.map != null && this.$store.state.activeRoute != null && this.$store.state.activeRoute.polyline != null){
      for (let i = 0;i < this.$store.state.activeRoute.polyline.length;i++) {
            var coords = this.$store.state.activeRoute.polyline[i].map(
              function (point) {
                return new mapkit.Coordinate(point[0], point[1]);
              }
            );
            var style = new mapkit.Style({
              lineWidth: 2,
              lineJoin: "round",
              strokeColor: "#F0F",
            });
            var polyline = new mapkit.PolylineOverlay(coords, { style: style });
            if (this.map != null){
              
            this.map.addOverlay(polyline);
            }
          }
      }
    },
    addToRoute(place) {
      this.$store.dispatch("addRouteStop", {
        name: place.name,
        formattedAddress: place.formattedAddress,
        coordinate: {
          latitude: place.coordinate.latitude,
          longitude: place.coordinate.longitude,
        },
      });
    },
    addToRouteNotPlace(name, address, latitude, longitude) {
      this.$store.dispatch("addRouteStop", {
        name: name,
        formattedAddress: address,
        coordinate: {
          latitude: latitude,
          longitude: longitude,
        },
      });
    },
    reloadData() {
      this.loadStops();
      this.loadAreasToAvoid();
      this.loadPolyline();
    },
    regionChanged() {
      if (
        this.$store.state.searchPredefined != "none" &&
        this.$store.state.searchPredefined != "nationalparks" &&
        this.$store.state.searchPredefined != "stateparks" && 
        this.$store.state.searchPredefined != "overnightparking"
      ) {
        if (
          this.center != null &&
          (this.center.latitude != this.map.region.center.latitude ||
            this.center.longitude != this.map.region.center.longitude)
        ) {
          //console.log("resetting predefined search");
          this.removeAnnotationFromList(this.predefinedSearchMarkers);
          this.predefinedSearchMarkers = [];
          let prevSearchPredefined = this.$store.state.searchPredefined
          this.$store.commit("setSearchPredefined", "none");
          setTimeout(() => {
          this.$store.commit("setSearchPredefined", prevSearchPredefined);
          },200)
        }
      }
      if (this.$store.state.searchPredefined == "stateparks") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers);
        this.predefinedSearchMarkers = [];
        this.getStateParks();
      }
      if (this.$store.state.searchPredefined == "coe_parks") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers);
        this.predefinedSearchMarkers = [];
        this.getCOEParks();
      }
      if (this.$store.state.searchPredefined == "campgrounds") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers);
        this.predefinedSearchMarkers = [];
        this.getCampgrounds();
      }
    },
    getDumpStations(zip){
      searchDumpStations(this.map.region,this.$store, zip, (annotations,markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(
            annotations[i].coordinate
          );
          this.map.addAnnotation(annotations[i]);
        }
        this.$store.dispatch("setSharedSearchMarkers",markers)
        this.center = this.map.region.center;
      });

    },
    getNationalParks(){
      getNationalParks(this.map.region,(annotations,markers) => {
                    for (let i = 0; i < annotations.length; i++) {
                      this.predefinedSearchMarkers.push(
                        annotations[i].coordinate
                      );
                      this.map.addAnnotation(annotations[i]);
                    }
                    this.$store.dispatch("setSharedSearchMarkers",markers)
                  });
    },
    getStateParks() {
      getStateParks(this.map.region, (annotations,markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate);
          this.map.addAnnotation(annotations[i]);
        }
        this.$store.dispatch("setSharedSearchMarkers",markers)
      });
    },
    getCOEParks() {
      getCOEParks(this.map.region, (annotations,markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate);
          this.map.addAnnotation(annotations[i]);
        }
        this.$store.dispatch("setSharedSearchMarkers",markers)
      });
    },
    getCampgrounds() {
      getCampgrounds(this.map.region, (annotations,markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate);
          this.map.addAnnotation(annotations[i]);
        }
        this.$store.dispatch("setSharedSearchMarkers",markers)
      });
    },
    getOvernightParking(){
      getOvernightParking(this.map.region,(annotations,markers)=>{
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate);
          this.map.addAnnotation(annotations[i]);
        }
        this.$store.dispatch("setSharedSearchMarkers",markers)
      })
    },
    longPress(evt) {
      var coordinate = this.map.convertPointOnPageToCoordinate(evt.pointOnPage);
      if (this.avoidStarted) {
        let points = [];
        points.push(
          new mapkit.Coordinate(
            this.avoidRectStart.latitude,
            this.avoidRectStart.longitude
          )
        );
        points.push(
          new mapkit.Coordinate(
            this.avoidRectStart.latitude,
            coordinate.longitude
          )
        );
        points.push(coordinate);
        points.push(
          new mapkit.Coordinate(
            coordinate.latitude,
            this.avoidRectStart.longitude
          )
        );
        var style = new mapkit.Style({
          strokeColor: "#F00",
          strokeOpacity: 0.5,
          lineWidth: 2,
          lineJoin: "round",
          lineDash: [], //[2, 2, 6, 2, 6, 2],
          fillOpacity:0.5,
          fillColor:"FF0000"
        });

        var rectangle = new mapkit.PolygonOverlay(points, { style: style });
        this.markedAreas.push(points)
        this.map.addOverlay(rectangle);
        this.$store.dispatch("addAreaToAvoid", {
          id: this.$store.state.activeRoute._id,
          points: points,
        });
        this.avoidStarted = false;
      } else {
        this.avoidStarted = true;
        this.avoidRectStart = new mapkit.Coordinate(
          coordinate.latitude,
          coordinate.longitude
        );
      }
    },
    loadAreasToAvoid() {
      
      if (this.$store.state.activeRoute == null || !this.maploaded || this.map == null) {
        return;
      }
      if (this.markedAreas.length > 0 && this.map.overlays.length > 0) {
        try {
          for (let i = 0; i < this.markedAreas.length; i++) {
            for (let j = 0; j < this.map.overlays.length; j++) {
              if (
                this.markedAreas[i][0].latitude ==
                  this.map.overlays[j].points[0][0].latitude &&
                this.markedAreas[i][0].longitude ==
                  this.map.overlays[j].points[0][0].longitude &&
                                  this.markedAreas[i][1].latitude ==
                  this.map.overlays[j].points[0][1].latitude &&
                this.markedAreas[i][1].longitude ==
                  this.map.overlays[j].points[0][1].longitude &&
                                  this.markedAreas[i][2].latitude ==
                  this.map.overlays[j].points[0][2].latitude &&
                this.markedAreas[i][2].longitude ==
                  this.map.overlays[j].points[0][2].longitude &&
                                  this.markedAreas[i][3].latitude ==
                  this.map.overlays[j].points[0][3].latitude &&
                this.markedAreas[i][3].longitude ==
                  this.map.overlays[j].points[0][3].longitude



              ) {
                this.map.removeOverlays([this.map.overlays[j]]);
              }
            }
          }
        } catch (err) {
          //console.log(err);
          let a = 1 + 2;
        }
        this.markedAreas.splice(0, this.markedAreas.length);
      }

      if (
        this.$store.state.activeRoute.areasToAvoid != null &&
        this.$store.state.activeRoute.areasToAvoid.length > 0
      ) {
        let areasToAvoid = this.$store.state.activeRoute.areasToAvoid;
        for (let i = 0; i < areasToAvoid.length; i++) {
          let points = [];
          points.push(new mapkit.Coordinate(areasToAvoid[i].point1.latitude,areasToAvoid[i].point1.longitude));
          points.push(new mapkit.Coordinate(areasToAvoid[i].point2.latitude,areasToAvoid[i].point2.longitude));
          points.push(new mapkit.Coordinate(areasToAvoid[i].point3.latitude,areasToAvoid[i].point3.longitude));
          points.push(new mapkit.Coordinate(areasToAvoid[i].point4.latitude,areasToAvoid[i].point4.longitude));
          var style = new mapkit.Style({
            strokeColor: "#F00",
            strokeOpacity: 0.5,
            lineWidth: 2,
            lineJoin: "round",
            lineDash: [], //[2, 2, 6, 2, 6, 2],
            fillOpacity:0.5,
            fillColor:"FF0000"
          });

          var rectangle = new mapkit.PolygonOverlay(points, { style: style });
          this.markedAreas.push(points)
          this.map.addOverlay(rectangle);

          var annotationOptions = {
            title:"Avoid",
            subtitle:"",
            url: { 1: "/static/avoid_area.png"},
            anchorOffset:new DOMPoint(0,-6),
            size:{height:8,width:60}
          }
          var annotation = new mapkit.ImageAnnotation(this.getCenterCoord(points),annotationOptions)
          this.map.addAnnotation(annotation)
        }
      }
    },
    removeAvoidRegion(points){
      this.areaToBeRemoved = points
      this.showRemoveAvoidAreaPopup = true
    },
    removeAvoidArea(doRemove){
      if (doRemove){
              this.$store.dispatch("removeAreaToAvoid", {
          id: this.$store.state.activeRoute._id,
          points: this.areaToBeRemoved,
        });
      }
      this.areaToBeRemoved = null
      this.showRemoveAvoidAreaPopup = false
      let deselectEvent = new Event("deselect")
      this.map.dispatchEvent(deselectEvent)
    },
    loadStops() {
      if (this.$store.state.activeRoute == null) {
        return;
      }
      if (this.stopMarkers.length > 0 && this.map.annotations.length > 0) {
        try {
          for (let i = 0; i < this.stopMarkers.length; i++) {
            for (let j = 0; j < this.map.annotations.length; j++) {
              if (
                this.stopMarkers[i].latitude ==
                  this.map.annotations[j].coordinate.latitude &&
                this.stopMarkers[i].longitude ==
                  this.map.annotations[j].coordinate.longitude
              ) {
                this.map.removeAnnotation(this.map.annotations[j]);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
        this.stopMarkers.splice(0, this.stopMarkers.length);
      }
      if (
        this.$store.state.activeRoute.stops != null &&
        this.$store.state.activeRoute.stops.length > 0 &&
        this.map != null
      ) {
        if (
          this.$store.state.currentLocation != null &&
          this.$store.state.currentLocation.latitude != null &&
          this.$store.state.currentLocation.longitude != null
        ) {
          var calloutDelegate = {
                    calloutElementForAnnotation: function (annotation) {
                        //console.log(annotation);
                        var element = document.createElement("div");
                        element.className = "annotation-detail";
                        var title = element.appendChild(
                            document.createElement("h3")
                        );
                        title.textContent = annotation.title;

                        var btn = element.appendChild(
                            document.createElement("button")
                        );

                        btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
                        btn.textContent = "Post Review";
                        btn.onclick = function () {
                          alert("post review")
                        };

                        return element;
                    },
                };
          let annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(
              this.$store.state.currentLocation.coords.latitude,
              this.$store.state.currentLocation.coords.longitude
            ),
            {
              title: "Start",
              subtitle: "",
              glyphText: "X",
              color: "#FF0000",
              displayPriority: 1000,
              callout: calloutDelegate
            }
          );

          this.stopMarkers.push(annotation.coordinate);
          this.map.addAnnotation(annotation);
        }
        for (let i = 0; i < this.$store.state.activeRoute.stops.length; i++) {
          var calloutDelegate2 = {
                    calloutElementForAnnotation: function (annotation) {
                        //console.log(annotation);
                        var element = document.createElement("div");
                        element.className = "annotation-detail";
                        var title = element.appendChild(
                            document.createElement("h3")
                        );
                        title.textContent = annotation.title;

                        var btn = element.appendChild(
                            document.createElement("button")
                        );

                        btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
                        btn.textContent = "Post Review";
                        btn.onclick = function () {
                          alert("post review")
                        };

                        return element;
                    },
                };
          let annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(
              this.$store.state.activeRoute.stops[i].coordinate.latitude,
              this.$store.state.activeRoute.stops[i].coordinate.longitude
            ),
            {
              title: this.$store.state.activeRoute.stops[i].name,
              subtitle: this.$store.state.activeRoute.stops[i].formattedAddress,
              glyphText: (i + 1).toString(),
              color: "#FF0000",
              displayPriority: 1000,
              callout: calloutDelegate2
            }
          );
          this.stopMarkers.push(annotation.coordinate);
          this.map.addAnnotation(annotation);
        }
      }
    },
    zoomToLocation(lat,lon){
      this.$store.commit("setNewMapRegion",{centerLat:lat,centerLon:lon,diffLat:0.001,diffLon:0.001})
      
    },
    showAnnotationDetails(annotation){
      this.$store.commit("setShowAnnotationDetails",annotation)
    },
    removeAnnotationDetails(){
      this.$store.commit("setShowAnnotationDetails",null)
    },
    getCenterCoord(locPoints){
      var x = 0.0
      var y = 0.0
      var z = 0.0
      for (let i=0;i<locPoints.length;i++){
        let lat = toRad(locPoints[i].latitude)
        let lon = toRad(locPoints[i].longitude)

        x += Math.cos(lat) * Math.cos(lon)
        y += Math.cos(lat) * Math.sin(lon)
        z += Math.sin(lat)
      }
      x = x / locPoints.length
      y = y / locPoints.length
      z = z / locPoints.length

      let resultLon = Math.atan2(y,x)
      let resultHyp = Math.sqrt(x * x + y * y)
      let resultLat = Math.atan2(z,resultHyp)
      let result = new mapkit.Coordinate(toDeg(resultLat),toDeg(resultLon))
      return result
    }
  },
};
</script>

<!-- style scoped>
#map {
  width: 800px;
  height: 600px;
}
</style -->
<style>
a.right-accessory-view {
  text-decoration: none;
}
div.review-callout {
  background-color: white;
}
</style>