<template>
  <div>
    <ModalPopup
      :yesNoOption="true"
      v-if="showRemoveAvoidAreaPopup"
      @yesAnswer="removeAvoidArea(true)"
      @noAnswer="removeAvoidArea(false)"
    >
      <div>You are about to remove an avoid area. Are you sure?</div>
    </ModalPopup>
    <!-- <TripSummary2 /> -->
    <!-- <SearchAlongTrip /> -->
    <div id="map" v-bind:style="{ width: map_width + 'px', height: map_height + 'px' }" class="z-0"></div>
  </div>
</template>
<script>
import { reactive } from "vue"
import axios from "axios"
import { searchGasStations } from "../../business_logic/GasStations"
import { searchDumpStations } from "../../business_logic/DumpStation"
import { getNationalParks } from "../../business_logic/NationalPark"
import { getStateParks } from "../../business_logic/StateParks"
import { getCOEParks } from "../../business_logic/COEParks"
import { getCampgrounds } from "../../business_logic/Campgrounds"
import { getOvernightParking } from "../../business_logic/OvernightParking"
import { getMapRestrictions } from "../../business_logic/MapRestrictions"
import { getRestAreas } from "../../business_logic/RestAreas"

import ModalPopup from "../templates/ModalPopup.vue"
// import TripSummary2 from "../trip/TripSummary2.vue"
// import SearchAlongTrip from "../trip/SearchAlongTrip.vue"
import { toRad, toDeg } from "../../business_logic/HelperLogic"

import { determineDistanceBetweenTwoPoints } from "../../business_logic/HelperLogic"

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
    // TripSummary2,
    // SearchAlongTrip,
  },
  data() {
    return {
      currentLocation: null,
      stopMarkers: [],
      predefinedSearchMarkers: [],
      center: null,
      avoidStarted: false,
      avoidRectStart: null,
      maploaded: false,
      markedAreas: [],
      showRemoveAvoidAreaPopup: false,
      areaToBeRemoved: null,
      search_id: null,
      searchAlongTripActive: false,
    }
  },
  created() {
    let appleMapKitScript = document.createElement("script")
    let self = this
    appleMapKitScript.onload = () => {
      const tokenID =
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZKRkI0Vlo0VUMifQ.eyJpc3MiOiI5MjJQUzc4S0pLIiwiaWF0IjoxNjM2OTk5OTk4LCJleHAiOjE2Njg0NzA0MDB9.geDTQF2SnneWBGy2vaE2EEQNqTbT4eM79imDhiLmF5ESaBRBjXaevvc6Z6_palG4hhYdtY0gtGH1ecgvCfrtiw"

      mapkit.init({
        authorizationCallback: function (done) {
          done(tokenID)
          window.mymapview.maploaded = true
        },
      })

      if (!("geolocation" in navigator)) {
        this.errorStr = "Geolocation is not available."
        return
      }

      navigator.geolocation.getCurrentPosition(function (position) {
        var mylat = position.coords.latitude
        var mylng = position.coords.longitude

        window.mymapview.currentLocation = position.coords

        var region = new mapkit.CoordinateRegion(
          new mapkit.Coordinate(mylat, mylng),
          new mapkit.CoordinateSpan(100, 100)
        )
        var tripRegion = window.mymapview.getTripRegion()
        if (tripRegion != null) {
          region = tripRegion
        }

        self.map = new mapkit.Map("map", {
          region: region,
          showsCompass: mapkit.FeatureVisibility.Hidden,
          showsZoomControl: true,
          showsMapTypeControl: true,
          showsUserLocation: true,
          tracksUserLocation: true,
          showsUserLocationControl: true,
        })

        self.map.addEventListener("region-change-end", function () {
          window.mymapview.regionChanged()
        })
        self.map.addEventListener("long-press", function (evt) {
          window.mymapview.longPress(evt)
        })
        self.map.addEventListener("select", function (event) {
          // console.log(event.annotation)
          if (event.overlay) {
            window.mymapview.removeAvoidRegion(event.overlay.points)
          }
          if (event.annotation) {
            window.mymapview.showAnnotationDetails(event.annotation)
          }
        })
        self.map.addEventListener("deselect", function (event) {
          for (let i = 0; i < self.map.overlays.length; i++) {
            self.map.overlays[i].selected = false
          }
          window.mymapview.removeAnnotationDetails()
        })
        window.mymapview.reloadData()
      })
    }
    appleMapKitScript.setAttribute("src", "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js")
    document.head.appendChild(appleMapKitScript)
  },
  mounted() {
    window.mymapview = this
  },

  computed: {
    keywords() {
      return this.$store.state.freetext_search.searchKeywords
    },
    polyline() {
      if (this.$store.state.activeTrip != null && this.$store.state.activeTrip.polyline != null) {
        // if (this.$store.state.activeTrip.polyline != null){
        //     return this.$store.state.activeTrip.polyline
        // }
        return this.$store.state.activeTrip.polyline.length
      }
      return null
    },
    stops() {
      if (this.$store.state.activeTrip != null && this.$store.state.activeTrip.stops != null) {
        return this.$store.state.activeTrip.stops.filter((s) => !s.daytrip).length
      }
      return null
    },
    areasToAvoid() {
      if (this.$store.state.activeTrip != null && this.$store.state.activeTrip.areasToAvoid != null) {
        return this.$store.state.activeTrip.areasToAvoid.length
      }
      return null
    },
  },
  watch: {
    // keywords(newValue, oldValue) {
    //   this.removeAnnotationFromList(this.stopMarkers)
    //   this.stopMarkers = []
    //   var search = new mapkit.Search({
    //     language: "en-GB",
    //     //getsUserLocation: true,
    //     region: map.region,
    //     includeAddresses: true,
    //     includePointsOfInterest: true,
    //     includeQueries: true,
    //   })
    //   console.log(newValue)
    //   search.search(newValue, (error, data) => {
    //     let annotations = []
    //     for (let i = 0; i < data.places.length; i++) {
    //       var calloutDelegate = {
    //         calloutElementForAnnotation: function (annotation) {
    //           var element = document.createElement("div")
    //           element.className = "annotation-detail"
    //           var title = element.appendChild(document.createElement("h3"))
    //           title.textContent = annotation.title

    //           if (data.places[i].urls.length > 0) {
    //             var link = element.appendChild(document.createElement("a"))
    //             link.className = "text-tiny"
    //             link.target = "_blank"
    //             link.href = data.places[i].urls[0]
    //             link.textContent = "Open Website"
    //             element.appendChild(document.createElement("br"))
    //           }

    //           var btn = element.appendChild(document.createElement("button"))
    //           btn.className = "annotation-callout-button"
    //           btn.textContent = "Add To Trip"
    //           btn.onclick = function () {
    //             window.mymapview.addToTrip(data.places[i])
    //             //this.parentNode.style.display = 'none';
    //           }
    //           var btn2 = element.appendChild(document.createElement("button"))
    //           btn2.className = "annotation-callout-button"
    //           btn2.textContent = "Add As Alternative"
    //           btn2.onclick = function () {
    //             window.mymapview.addToTrip(data.places[i], true)
    //             //this.parentNode.style.display = 'none';
    //           }

    //           return element
    //         },
    //       }
    //       const annotation = new mapkit.MarkerAnnotation(data.places[i].coordinate, {
    //         title: data.places[i].name,
    //         subtitle: data.places[i].formattedAddress,
    //         glyphText: "",
    //         color: "#8e8e93",
    //         displayPriority: 1000,
    //         //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
    //         callout: calloutDelegate,
    //       })
    //       this.map.addAnnotation(annotation)
    //       const marker = {
    //         title: data.places[i].name,
    //         address: data.places[i].formattedAddress,
    //         coordinate: {
    //           latitude: data.places[i].coordinate.latitude,
    //           longitude: data.places[i].coordinate.longitude,
    //         },
    //         contents: "",
    //         distance: -1,
    //       }
    //       annotations.push(marker)
    //     }
    //     this.$store.commit("clearSharedSearchMarkers")
    //     this.$store.commit("setSharedSearchMarkers", annotations)
    //     //console.log(data)
    //   })
    // },
    polyline(newValue, oldValue) {
      if (newValue != null && this.map != null) {
        if (newValue > 0) {
          this.loadPolyline()
        } else {
          if (this.map != null && this.map.overlays != null) {
            this.map.removeOverlays(this.map.overlays)
          }
        }
      }
    },
    stops(newValue, oldValue) {
      this.loadStops()
    },
    areasToAvoid(newValue, oldValue) {
      this.loadAreasToAvoid()
    },
    "$store.state.activeTrip": function (newValue, oldValue) {
      if (this.map != null && this.map.overlays != null && newValue == null) {
        this.map.removeOverlays(this.map.overlays)
        this.map.removeAnnotations(this.map.annotations)
      }
      this.loadStops()
      this.loadPolyline()
      this.loadAreasToAvoid()
    },
    "$store.state.currentLocation": function () {
      this.loadStops()
      this.loadAreasToAvoid()
    },
    "$store.state.mapRegion": function () {
      // console.log("map region changed")
      let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(
          this.$store.state.mapRegion.center.latitude,
          this.$store.state.mapRegion.center.longitude
        ),
        new mapkit.CoordinateSpan(
          this.$store.state.mapRegion.span.latitudeSpan,
          this.$store.state.mapRegion.span.longitudeSpan
        )
      )
      this.map.setRegionAnimated(region, true)
    },
    "$store.state.predefined_search.searchPredefined": function () {
      this.removeAnnotationFromList(this.predefinedSearchMarkers)
      this.$store.commit("clearSharedSearchMarkers")
      this.predefinedSearchMarkers = []
      if (this.map != null) {
        let latitude = this.map.center.latitude
        let longitude = this.map.center.longitude

        var geocoder = new mapkit.Geocoder()
        geocoder.reverseLookup(new mapkit.Coordinate(latitude, longitude), (err, data) => {
          if (err == null) {
            if (data != null && data.results.length > 0) {
              var city = data.results[0].locality
              var state = data.results[0].administrativeAreaCode
              var zip = data.results[0].postCode
              var country = data.results[0].countryCode
              if (this.$store.state.predefined_search.searchPredefined == "gasstations") {
                searchGasStations(
                  this.map.region,
                  this.$store,
                  city,
                  state,
                  zip,
                  country,
                  this.searchAlongTripActive,
                  this.searchAlongTripActive ? this.$store.state.alongRoutePolyline : [],
                  (annotations, markers) => {
                    // console.log(annotations)
                    for (let i = 0; i < annotations.length; i++) {
                      this.predefinedSearchMarkers.push(annotations[i].coordinate)

                      this.map.addAnnotation(annotations[i])
                    }
                    this.$store.dispatch("setSharedSearchMarkers", markers)

                    if (this.searchAlongTripActive) {
                      this.zoomToAnnotationRegion(this.predefinedSearchMarkers)
                      this.searchAlongTripActive = false
                    } else {
                      this.center = this.map.region.center
                    }
                  }
                )
              }
              if (this.$store.state.predefined_search.searchPredefined == "dumpstations") {
                this.getDumpStations(zip)
              }
              if (this.$store.state.predefined_search.searchPredefined == "nationalparks") {
                this.getNationalParks()
              }
              if (this.$store.state.predefined_search.searchPredefined == "stateparks") {
                this.getStateParks()
              }
              if (this.$store.state.predefined_search.searchPredefined == "coe_parks") {
                this.getCOEParks()
              }
              if (this.$store.state.predefined_search.searchPredefined == "campgrounds") {
                this.getCampgrounds()
              }
              if (this.$store.state.predefined_search.searchPredefined == "overnightparking") {
                this.getOvernightParking()
              }
              if (this.$store.state.predefined_search.searchPredefined == "restareas") {
                this.getRestAreas()
              }
            }
          }
        })
      }
    },
  },
  methods: {
    executeMapSearch(searchVal) {
      if (searchVal == "") {
        this.$store.commit("freetext_search/clearSearchResult")
        return
      }
      this.$store.commit("clearSessionStatus")
      this.$store.commit("setSessionStatus", "Searching for " + searchVal)
      // this.removeAnnotationFromList(this.stopMarkers)
      this.stopMarkers = []
      var search = new mapkit.Search({
        language: "en-GB",
        //getsUserLocation: true,
        region: map.region,
        includeAddresses: true,
        includePointsOfInterest: true,
        includeQueries: true,
      })

      if (this.search_id != null) {
        search.cancel(this.search_id)
        this.search_id = null
        this.$store.commit("clearSessionStatus")
      }
      this.search_id = search.search(searchVal, (error, data) => {
        this.$store.commit("freetext_search/setSearch", searchVal)
        this.search_id = null

        for (let i = 0; i < this.map.annotations.length; i++) {
          let ann = []
          if (this.map.annotations[i].color == "#9000ff") {
            ann.push(this.map.annotations[i])
          }
          this.map.removeAnnotations(ann)
        }
        if (data != null && data.places != null) {
          this.$store.commit("freetext_search/addSearchResult", data.places)
          this.$store.commit("clearSessionStatus")
        } else {
          this.$store.commit("freetext_search/clearSearchResult")
          this.$store.commit("clearSessionStatus")
        }
        //console.log(data)
      })
    },
    removeSearchAnnotations() {
      for (let i = 0; i < this.map.annotations.length; i++) {
        let ann = []
        if (this.map.annotations[i].color == "#9000ff") {
          ann.push(this.map.annotations[i])
        }
        this.map.removeAnnotations(ann)
      }
    },
    addAnnotationToMap(place) {
      var calloutDelegate = {
        calloutElementForAnnotation: function (annotation) {
          var element = document.createElement("div")
          element.className = "annotation-detail"
          var title = element.appendChild(document.createElement("h3"))
          title.textContent = annotation.title

          if (place.urls.length > 0) {
            var link = element.appendChild(document.createElement("a"))
            link.className = "text-tiny"
            link.target = "_blank"
            link.href = place.urls[0]
            link.textContent = "Open Website"
            element.appendChild(document.createElement("br"))
          }

          var btn = element.appendChild(document.createElement("button"))
          btn.className = "annotation-callout-button"
          btn.textContent = "Add To Trip"
          btn.onclick = function () {
            window.mymapview.addToTrip(place)
            //this.parentNode.style.display = 'none';
          }
          if (window.mymapview.hasNearbyStops(annotation.coordinate)) {
            var btn2 = element.appendChild(document.createElement("button"))
            btn2.className = "annotation-callout-button"
            btn2.textContent = "Add As Alternative"
            btn2.onclick = function () {
              window.mymapview.addToTrip(place, true)
              //this.parentNode.style.display = 'none';
            }
          }
          return element
        },
      }
      const annotation = new mapkit.MarkerAnnotation(place.coordinate, {
        title: place.name,
        subtitle: place.formattedAddress,
        glyphText: "SR",
        color: "#9000ff",
        displayPriority: 1000,
        //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
        callout: calloutDelegate,
      })
      // this.map.addAnnotation(annotation)
      // this.$store.commit("freetext_search/addSearchResult", annotation)
      const marker = {
        title: place.name,
        address: place.formattedAddress,
        coordinate: {
          latitude: place.coordinate.latitude,
          longitude: place.coordinate.longitude,
        },
        contents: "",
        distance: -1,
      }

      this.map.addAnnotation(annotation)
      let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(marker.coordinate.latitude, marker.coordinate.longitude),
        new mapkit.CoordinateSpan(5, 5)
      )
      this.map.setRegionAnimated(region, true)
    },
    getStopDetails(idx) {
      return this.$store.state.activeTrip.stops[idx]
    },
    getAltStopDetails(idx1, idx2) {
      let altStops = this.$store.state.activeTrip.stops.filter((s) => s.alt_stop != null && s.alt_stop.length > 0)
      return altStops[idx1].alt_stop[idx2]
    },
    getArrivalDate(idx) {
      if (this.$store.state.activeTrip.dates.length > 0 && this.$store.state.activeTrip.dates.length > idx) {
        let prev_idx = -1
        for (let i = idx - 1; i > -1; i--) {
          if (this.$store.state.activeTrip.dates[i] != null) {
            prev_idx = i
          }
        }
        if (prev_idx > -1) {
          return this.$store.state.activeTrip.dates[prev_idx]
        } else {
          return null
        }
      } else {
        if (idx == this.$store.state.activeTrip.stops.length - 1) {
          return this.$store.state.activeTrip.dates[this.$store.state.activeTrip.dates.length - 1]
        }
      }
      return null
    },
    getDepartureDate(idx) {
      if (this.$store.state.activeTrip.dates.length > 0 && this.$store.state.activeTrip.dates.length > idx) {
        return this.$store.state.activeTrip.dates[idx]
      }
      return null
    },
    removeAnnotationFromList(list) {
      if (this.map != null && this.map.annotations != null) {
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.map.annotations.length; j++) {
            if (
              list[i].latitude == this.map.annotations[j].coordinate.latitude &&
              list[i].longitude == this.map.annotations[j].coordinate.longitude
            ) {
              this.map.removeAnnotation(this.map.annotations[j])
              break
            }
          }
        }
      }
    },
    loadPolyline() {
      if (this.map != null && this.map.overlays != null && this.map.overlays.length > 0) {
        for (let i = 0; i < this.map.overlays.length; i++) {
          //console.log(this.map.overlays[i].points.length)
          if (this.map.overlays[i].points.length > 1) {
            this.map.removeOverlays([this.map.overlays[i]])
          }
        }
      }
      if (this.map != null && this.$store.state.activeTrip != null && this.$store.state.activeTrip.polyline != null) {
        for (let i = 0; i < this.$store.state.activeTrip.polyline.length; i++) {
          var coords = this.$store.state.activeTrip.polyline[i].map(function (point) {
            return new mapkit.Coordinate(point[0], point[1])
          })
          var style = new mapkit.Style({
            lineWidth: 2,
            lineJoin: "round",
            strokeColor: "#F0F",
          })
          var polyline = new mapkit.PolylineOverlay(coords, { style: style })
          if (this.map != null) {
            this.map.addOverlay(polyline)
          }
        }

        if (
          this.$store.state.activeTrip.daytrips != null &&
          this.$store.state.activeTrip.daytrips[0] != null &&
          this.$store.state.activeTrip.daytrips[0].polylines != null &&
          this.$store.state.activeTrip.daytrips[0].polylines.length > 0
        ) {
          // console.log("daytrip polylines found")
          for (let k = 0; k < this.$store.state.activeTrip.daytrips[0].polylines.length; k++) {
            // console.log(this.$store.state.activeTrip.daytrips[0].polylines[k])
            if (this.$store.state.activeTrip.daytrips[0].polylines[k].length > 0) {
              // console.log("daytrip polyline for idx " + k)
              for (let i = 0; i < this.$store.state.activeTrip.daytrips[0].polylines[k].length; i++) {
                // console.log(this.$store.state.activeTrip.daytrips[0].polylines[k][i].polyline[i])
                var coords2 = this.$store.state.activeTrip.daytrips[0].polylines[k][i].polyline.map(function (point) {
                  return new mapkit.Coordinate(point[0], point[1])
                })
                var style2 = new mapkit.Style({
                  lineWidth: 2,
                  lineJoin: "round",
                  strokeColor: "#1f43d3",
                })
                var polyline2 = new mapkit.PolylineOverlay(coords2, {
                  style: style2,
                })
                // console.log(polyline2)
                if (this.map != null) {
                  // console.log("adding polyline2")
                  this.map.addOverlay(polyline2)
                  // console.log(this.map.overlays)
                }
              }
            }
          }
        }
      }
    },

    addToTrip(place, alt = false) {
      if (!alt) {
        this.$store.dispatch("addTripStop", {
          name: place.name,
          formattedAddress: place.formattedAddress,
          coordinate: {
            latitude: place.coordinate.latitude,
            longitude: place.coordinate.longitude,
          },
        })
      } else {
        this.$store.dispatch("showNearbyStopsForAlternative", {
          name: place.name,
          formattedAddress: place.formattedAddress,
          coordinate: {
            latitude: place.coordinate.latitude,
            longitude: place.coordinate.longitude,
          },
        })
      }
    },
    addToTripNotPlace(name, address, latitude, longitude, alt = false) {
      if (!alt) {
        this.$store.dispatch("addTripStop", {
          name: name,
          formattedAddress: address,
          coordinate: {
            latitude: latitude,
            longitude: longitude,
          },
        })
      } else {
        this.$store.dispatch("showNearbyStopsForAlternative", {
          name: name,
          formattedAddress: address,
          coordinate: {
            latitude: latitude,
            longitude: longitude,
          },
        })
      }
    },
    removeStopAlternative(stop_id, alt_stop_id) {
      console.log(stop_id)
      this.$store.dispatch("removeStopAlternative", { stop_id: stop_id, alt_stop_id: alt_stop_id })
    },
    reloadData() {
      this.loadStops()
      this.loadAreasToAvoid()
      this.loadPolyline()
    },
    regionChanged() {
      // console.log(this.map.region)
      if (this.searchAlongTripActive) {
        return
      }
      if (
        this.$store.state.predefined_search.searchPredefined != "none" &&
        this.$store.state.predefined_search.searchPredefined != "nationalparks" &&
        this.$store.state.predefined_search.searchPredefined != "stateparks" &&
        this.$store.state.predefined_search.searchPredefined != "overnightparking"
      ) {
        if (
          this.center != null &&
          (this.center.latitude != this.map.region.center.latitude ||
            this.center.longitude != this.map.region.center.longitude)
        ) {
          //console.log("resetting predefined search");
          this.removeAnnotationFromList(this.predefinedSearchMarkers)
          this.predefinedSearchMarkers = []
          let prevSearchPredefined = this.$store.state.predefined_search.searchPredefined
          this.$store.commit("predefined_search/setSearchPredefined", "none")
          setTimeout(() => {
            this.$store.commit("predefined_search/setSearchPredefined", prevSearchPredefined)
          }, 200)
        }
      }
      if (this.$store.state.predefined_search.searchPredefined == "stateparks") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers)
        this.predefinedSearchMarkers = []
        this.getStateParks()
      }
      if (this.$store.state.predefined_search.searchPredefined == "coe_parks") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers)
        this.predefinedSearchMarkers = []
        this.getCOEParks()
      }
      if (this.$store.state.predefined_search.searchPredefined == "campgrounds") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers)
        this.predefinedSearchMarkers = []
        this.getCampgrounds()
      }
      if (this.$store.state.predefined_search.searchPredefined == "restareas") {
        this.removeAnnotationFromList(this.predefinedSearchMarkers)
        this.predefinedSearchMarkers = []
        this.getRestAreas()
      }
      this.getMapRestrictions()
    },
    getTripRegion() {
      if (this.$store.state.activeTrip != null) {
        var lowestLat = 9999999
        var lowestLon = 9999999
        var highestLat = -9999999
        var highestLon = -9999999
        let stopStartIdx = 0
        if (this.$store.state.activeTrip.searchPredefined != null && this.$store.state.activeTrip.searchPredefined) {
          lowestLat = this.$store.state.activeTrip.stops[0].coordinate.latitude
          highestLat = this.$store.state.activeTrip.stops[0].coordinate.latitude
          lowestLon = this.$store.state.activeTrip.stops[0].coordinate.longitude
          highestLon = this.$store.state.activeTrip.stops[0].coordinate.longitude
          stopStartIdx = 1
        } else {
          // lowestLat = this.$store.state.currentLocation.coords.latitude
          // highestLat = this.$store.state.currentLocation.coords.latitude
          // lowestLon = this.$store.state.currentLocation.coords.longitude
          // highestLon = this.$store.state.currentLocation.coords.longitude
          lowestLat = 999
          highestLat = -999
          lowestLon = 999
          highestLon = -999
        }

        for (let i = stopStartIdx; i < this.$store.state.activeTrip.stops.length; i++) {
          if (this.$store.state.activeTrip.stops[i].coordinate.latitude < lowestLat) {
            lowestLat = this.$store.state.activeTrip.stops[i].coordinate.latitude
          }
          if (this.$store.state.activeTrip.stops[i].coordinate.latitude > highestLat) {
            highestLat = this.$store.state.activeTrip.stops[i].coordinate.latitude
          }
          if (this.$store.state.activeTrip.stops[i].coordinate.longitude < lowestLon) {
            lowestLon = this.$store.state.activeTrip.stops[i].coordinate.longitude
          }
          if (this.$store.state.activeTrip.stops[i].coordinate.longitude > highestLon) {
            highestLon = this.$store.state.activeTrip.stops[i].coordinate.longitude
          }
        }
        if (this.$store.state.activeTrip.polyline.length > 0) {
          for (let i = 0; i < this.$store.state.activeTrip.polyline.length; i++) {
            for (let j = 0; j < this.$store.state.activeTrip.polyline[i].length; j++) {
              if (this.$store.state.activeTrip.polyline[i][j][0] < lowestLat) {
                lowestLat = this.$store.state.activeTrip.polyline[i][j][0]
              }
              if (this.$store.state.activeTrip.polyline[i][j][0] > highestLat) {
                highestLat = this.$store.state.activeTrip.polyline[i][j][0]
              }
              if (this.$store.state.activeTrip.polyline[i][j][1] < lowestLon) {
                lowestLon = this.$store.state.activeTrip.polyline[i][j][1]
              }
              if (this.$store.state.activeTrip.polyline[i][j][1] > highestLon) {
                highestLon = this.$store.state.activeTrip.polyline[i][j][1]
              }
            }
          }
        }

        var centerLat = (highestLat - lowestLat) / 2 + lowestLat
        var centerLon = (highestLon - lowestLon) / 2 + lowestLon
        var diffLat = (highestLat - lowestLat) * 1.1
        var diffLon = (highestLon - lowestLon) * 1.1
        this.$store.commit("setNewMapRegion", {
          centerLat: centerLat,
          centerLon: centerLon,
          diffLat: diffLat,
          diffLon: diffLon,
        })
        var region = new mapkit.CoordinateRegion(
          new mapkit.Coordinate(centerLat, centerLon),
          new mapkit.CoordinateSpan(diffLat, diffLon)
        )
        return region
      }
      return null
    },
    getDumpStations(zip) {
      searchDumpStations(this.map.region, this.$store, zip, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
        this.center = this.map.region.center
      })
    },
    getNationalParks() {
      getNationalParks(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getStateParks() {
      getStateParks(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getCOEParks() {
      getCOEParks(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getCampgrounds() {
      getCampgrounds(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getOvernightParking() {
      getOvernightParking(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getRestAreas() {
      getRestAreas(this.map.region, (annotations, markers) => {
        for (let i = 0; i < annotations.length; i++) {
          this.predefinedSearchMarkers.push(annotations[i].coordinate)
          this.map.addAnnotation(annotations[i])
        }
        this.$store.dispatch("setSharedSearchMarkers", markers)
      })
    },
    getMapRestrictions() {
      let ann = []
      for (let i = 0; i < this.map.annotations.length; i++) {
        if (
          this.map.annotations[i].glyphImage != null &&
          this.map.annotations[i].glyphImage["1"] == "/static/bridge-clearance.png"
        ) {
          ann.push(this.map.annotations[i])
        }
      }
      this.map.removeAnnotations(ann)
      let max_height = 0
      if (this.$store.state.activeRV != null && this.$store.state.activeRV.height != null) {
        max_height = this.$store.state.activeRV.height
      }
      getMapRestrictions(this.map.region, max_height, (annotations) => {
        this.map.addAnnotations(annotations)
      })
    },
    longPress(evt) {
      var coordinate = this.map.convertPointOnPageToCoordinate(evt.pointOnPage)
      if (this.avoidStarted) {
        let points = []
        points.push(new mapkit.Coordinate(this.avoidRectStart.latitude, this.avoidRectStart.longitude))
        points.push(new mapkit.Coordinate(this.avoidRectStart.latitude, coordinate.longitude))
        points.push(coordinate)
        points.push(new mapkit.Coordinate(coordinate.latitude, this.avoidRectStart.longitude))
        var style = new mapkit.Style({
          strokeColor: "#F00",
          strokeOpacity: 0.5,
          lineWidth: 2,
          lineJoin: "round",
          lineDash: [], //[2, 2, 6, 2, 6, 2],
          fillOpacity: 0.5,
          fillColor: "FF0000",
        })

        var rectangle = new mapkit.PolygonOverlay(points, { style: style })
        this.markedAreas.push(points)
        this.map.addOverlay(rectangle)
        this.$store.dispatch("addAreaToAvoid", {
          id: this.$store.state.activeTrip._id,
          points: points,
        })
        this.avoidStarted = false
      } else {
        this.avoidStarted = true
        this.avoidRectStart = new mapkit.Coordinate(coordinate.latitude, coordinate.longitude)
      }
    },
    loadAreasToAvoid() {
      if (this.$store.state.activeTrip == null || !this.maploaded || this.map == null) {
        return
      }
      if (this.markedAreas.length > 0 && this.map.overlays.length > 0) {
        try {
          for (let i = 0; i < this.markedAreas.length; i++) {
            for (let j = 0; j < this.map.overlays.length; j++) {
              if (
                this.markedAreas[i][0].latitude == this.map.overlays[j].points[0][0].latitude &&
                this.markedAreas[i][0].longitude == this.map.overlays[j].points[0][0].longitude &&
                this.markedAreas[i][1].latitude == this.map.overlays[j].points[0][1].latitude &&
                this.markedAreas[i][1].longitude == this.map.overlays[j].points[0][1].longitude &&
                this.markedAreas[i][2].latitude == this.map.overlays[j].points[0][2].latitude &&
                this.markedAreas[i][2].longitude == this.map.overlays[j].points[0][2].longitude &&
                this.markedAreas[i][3].latitude == this.map.overlays[j].points[0][3].latitude &&
                this.markedAreas[i][3].longitude == this.map.overlays[j].points[0][3].longitude
              ) {
                this.map.removeOverlays([this.map.overlays[j]])
              }
            }
          }
        } catch (err) {
          //console.log(err);
          let a = 1 + 2
        }
        this.markedAreas.splice(0, this.markedAreas.length)
      }

      if (this.$store.state.activeTrip.areasToAvoid != null && this.$store.state.activeTrip.areasToAvoid.length > 0) {
        let areasToAvoid = this.$store.state.activeTrip.areasToAvoid
        for (let i = 0; i < areasToAvoid.length; i++) {
          let points = []
          points.push(new mapkit.Coordinate(areasToAvoid[i].point1.latitude, areasToAvoid[i].point1.longitude))
          points.push(new mapkit.Coordinate(areasToAvoid[i].point2.latitude, areasToAvoid[i].point2.longitude))
          points.push(new mapkit.Coordinate(areasToAvoid[i].point3.latitude, areasToAvoid[i].point3.longitude))
          points.push(new mapkit.Coordinate(areasToAvoid[i].point4.latitude, areasToAvoid[i].point4.longitude))
          var style = new mapkit.Style({
            strokeColor: "#F00",
            strokeOpacity: 0.5,
            lineWidth: 2,
            lineJoin: "round",
            lineDash: [], //[2, 2, 6, 2, 6, 2],
            fillOpacity: 0.5,
            fillColor: "FF0000",
          })

          var rectangle = new mapkit.PolygonOverlay(points, { style: style })
          this.markedAreas.push(points)
          this.map.addOverlay(rectangle)

          var annotationOptions = {
            title: "Avoid",
            subtitle: "",
            url: { 1: "/static/avoid_area.png" },
            anchorOffset: new DOMPoint(0, -6),
            size: { height: 8, width: 60 },
          }
          var annotation = new mapkit.ImageAnnotation(this.getCenterCoord(points), annotationOptions)
          this.map.addAnnotation(annotation)
        }
      }
    },
    removeAvoidRegion(points) {
      this.areaToBeRemoved = points
      this.showRemoveAvoidAreaPopup = true
    },
    removeAvoidArea(doRemove) {
      if (doRemove) {
        this.$store.dispatch("removeAreaToAvoid", {
          id: this.$store.state.activeTrip._id,
          points: this.areaToBeRemoved,
        })
      }
      this.areaToBeRemoved = null
      this.showRemoveAvoidAreaPopup = false
      let deselectEvent = new Event("deselect")
      this.map.dispatchEvent(deselectEvent)
    },
    loadStops() {
      if (this.$store.state.activeTrip == null) {
        return
      }
      if (this.stopMarkers.length > 0 && this.map.annotations.length > 0) {
        try {
          for (let i = 0; i < this.stopMarkers.length; i++) {
            for (let j = 0; j < this.map.annotations.length; j++) {
              if (
                this.stopMarkers[i].latitude == this.map.annotations[j].coordinate.latitude &&
                this.stopMarkers[i].longitude == this.map.annotations[j].coordinate.longitude
              ) {
                this.map.removeAnnotation(this.map.annotations[j])
              }
            }
          }
        } catch (err) {
          console.log(err)
        }
        this.stopMarkers.splice(0, this.stopMarkers.length)
      }
      if (
        this.$store.state.activeTrip.stops != null &&
        this.$store.state.activeTrip.stops.length > 0 &&
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
              var element = document.createElement("div")
              element.className = "annotation-detail"
              var title = element.appendChild(document.createElement("h3"))
              title.textContent = annotation.title

              // var btn2 = element.appendChild(document.createElement("button"))

              // btn2.className = "annotation-callout-button"
              // btn2.textContent = "Add Stop Comment"
              // btn2.onclick = function () {
              //   alert("post review")
              // }

              // var btn = element.appendChild(document.createElement("button"))

              // btn.className = "annotation-callout-button"
              // btn.textContent = "Post Review"
              // btn.onclick = function () {
              //   alert("post review")
              // }

              return element
            },
          }
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
              callout: calloutDelegate,
            }
          )

          this.stopMarkers.push(annotation.coordinate)
          this.map.addAnnotation(annotation)
        }
        let altStops = this.$store.state.activeTrip.stops.filter((s) => s.alt_stop != null && s.alt_stop.length > 0)

        if (altStops.length > 0) {
          for (let i = 0; i < altStops.length; i++) {
            for (let j = 0; j < altStops[i].alt_stop.length; j++) {
              var calloutDelegate3 = {
                calloutElementForAnnotation: function (annotation) {
                  //console.log(annotation);
                  var stop = window.mymapview.getAltStopDetails(i, j)
                  // console.log(stop)
                  var element = document.createElement("div")
                  element.id = "callout_" + stop._id
                  element.className = "annotation-detail"
                  var title = element.appendChild(document.createElement("h3"))
                  title.textContent = annotation.title
                  var subtitle = element.appendChild(document.createElement("div"))
                  subtitle.textContent = "*** Alternative Stop ***"
                  subtitle.style = "font-size:0.6rem;"
                  let arr_date = window.mymapview.getArrivalDate(i)
                  if (arr_date != null && !stop.daytrip) {
                    var arr_dt = element.appendChild(document.createElement("div"))
                    arr_dt.textContent = "Scheduled arrival: " + window.mymapview.getDateFormatted(arr_date)
                  }
                  let dpt_date = window.mymapview.getDepartureDate(i)
                  if (dpt_date != null) {
                    var dt = element.appendChild(document.createElement("div"))
                    dt.textContent = "Scheduled departure: " + window.mymapview.getDateFormatted(dpt_date)
                    dt.style = "margin-bottom:0.5rem;"
                  }
                  var btn2 = element.appendChild(document.createElement("button"))

                  btn2.className = "annotation-callout-button"

                  btn2.textContent = "Show/Hide Stop Comments"
                  btn2.onclick = function () {
                    // window.mymapview.editStopComments(stop._id)
                    var t = document.getElementById("stop_comments_" + stop._id)
                    var e = document.getElementById("callout_" + stop._id)
                    //console.log(e.style)
                    if (t.style.display == "inline-block") {
                      t.style.display = ""
                      // e.clientWidth = e.clientWidth / 2
                      e.style["min-width"] = ""
                    } else {
                      t.style.display = "inline-block"
                      e.style = "min-width:20rem;"
                    }
                  }
                  var btn = element.appendChild(document.createElement("button"))

                  btn.className = "annotation-callout-button"
                  btn.textContent = "Remove As Alternative"
                  btn.onclick = function () {
                    window.mymapview.removeStopAlternative(altStops[i]._id, altStops[i].alt_stop[j]._id)
                  }
                  var comments = element.appendChild(document.createElement("textarea"))
                  comments.id = "stop_comments_" + stop._id
                  comments.className = "stop-comments"
                  if (stop.comments != null) {
                    comments.value = stop.comments
                  } else {
                    comments.value = ""
                  }
                  comments.addEventListener("blur", () => {
                    var c = document.getElementById("stop_comments_" + stop._id)
                    window.mymapview.updateStopComments(stop._id, c.value)
                  })
                  return element
                },
              }
              let annotation = new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(
                  altStops[i].alt_stop[j].coordinate.latitude,
                  altStops[i].alt_stop[j].coordinate.longitude
                ),
                {
                  title: altStops[i].alt_stop[j].name,
                  subtitle: altStops[i].alt_stop[j].formattedAddress,
                  glyphText: "Alt",
                  color: "#ffc62e",
                  displayPriority: 1000,
                  callout: calloutDelegate3,
                }
              )
              this.stopMarkers.push(annotation.coordinate)
              this.map.addAnnotation(annotation)
            }
          }
        }

        let mainRouteMarker = 0
        for (let i = 0; i < this.$store.state.activeTrip.stops.length; i++) {
          if (!this.$store.state.activeTrip.stops[i].daytrip) {
            mainRouteMarker++
          }
          var calloutDelegate2 = {
            calloutElementForAnnotation: function (annotation) {
              //console.log(annotation);
              var stop = window.mymapview.getStopDetails(i)
              var element = document.createElement("div")
              element.id = "callout_" + stop._id
              element.className = "annotation-detail"
              var title = element.appendChild(document.createElement("h3"))
              title.textContent = annotation.title
              let arr_date = window.mymapview.getArrivalDate(i)
              if (arr_date != null && !stop.daytrip) {
                var arr_dt = element.appendChild(document.createElement("div"))
                arr_dt.textContent = "Scheduled arrival: " + window.mymapview.getDateFormatted(arr_date)
              }

              let dpt_date = window.mymapview.getDepartureDate(i)
              if (dpt_date != null) {
                var dt = element.appendChild(document.createElement("div"))
                dt.textContent =
                  (stop.daytrip ? "Scheduled date: " : "Scheduled departure: ") +
                  window.mymapview.getDateFormatted(dpt_date)
                dt.style = "margin-bottom:0.5rem;"
              }
              var btn2 = element.appendChild(document.createElement("button"))

              btn2.className = "annotation-callout-button"

              btn2.textContent = "Show/Hide Stop Comments"
              btn2.onclick = function () {
                // window.mymapview.editStopComments(stop._id)
                var t = document.getElementById("stop_comments_" + stop._id)
                var e = document.getElementById("callout_" + stop._id)
                //console.log(e.style)
                if (t.style.display == "inline-block") {
                  t.style.display = ""
                  // e.clientWidth = e.clientWidth / 2
                  e.style["min-width"] = ""
                } else {
                  t.style.display = "inline-block"
                  e.style = "min-width:20rem;"
                }
              }
              var btn = element.appendChild(document.createElement("button"))

              btn.className = "annotation-callout-button"
              btn.textContent = "Post Review"
              btn.onclick = function () {
                alert("post review")
              }
              var comments = element.appendChild(document.createElement("textarea"))
              comments.id = "stop_comments_" + stop._id
              comments.className = "stop-comments"
              if (stop.comments != null) {
                comments.value = stop.comments
              } else {
                comments.value = ""
              }
              comments.addEventListener("blur", () => {
                var c = document.getElementById("stop_comments_" + stop._id)
                window.mymapview.updateStopComments(stop._id, c.value)
              })
              return element
            },
          }
          let annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(
              this.$store.state.activeTrip.stops[i].coordinate.latitude,
              this.$store.state.activeTrip.stops[i].coordinate.longitude
            ),
            {
              title: this.$store.state.activeTrip.stops[i].name,
              subtitle: this.$store.state.activeTrip.stops[i].formattedAddress,
              glyphText: !this.$store.state.activeTrip.stops[i].daytrip ? mainRouteMarker.toString() : "DT",
              color: !this.$store.state.activeTrip.stops[i].daytrip ? "#FF0000" : "#092285",
              displayPriority: 1000,
              callout: calloutDelegate2,
            }
          )
          this.stopMarkers.push(annotation.coordinate)
          this.map.addAnnotation(annotation)
        }
      }
    },
    zoomToLocation(lat, lon) {
      this.$store.commit("setNewMapRegion", {
        centerLat: lat,
        centerLon: lon,
        diffLat: 0.001,
        diffLon: 0.001,
      })
    },
    zoomToAnnotationRegion(annotations) {
      if (annotations.length == 0) {
        return
      }
      // console.log(annotations)
      var lowestLat = 9999999
      var lowestLon = 9999999
      var highestLat = -9999999
      var highestLon = -9999999

      for (let i = 0; i < annotations.length; i++) {
        if (annotations[i].latitude < lowestLat) {
          lowestLat = annotations[i].latitude
        }
        if (annotations[i].latitude > highestLat) {
          highestLat = annotations[i].latitude
        }
        if (annotations[i].longitude < lowestLon) {
          lowestLon = annotations[i].longitude
        }
        if (annotations[i].longitude > highestLon) {
          highestLon = annotations[i].longitude
        }
      }

      var centerLat = (highestLat - lowestLat) / 2 + lowestLat
      var centerLon = (highestLon - lowestLon) / 2 + lowestLon
      var diffLat = (highestLat - lowestLat) * 1.1
      var diffLon = (highestLon - lowestLon) * 1.1

      // console.log(diffLat + " - " + diffLon)
      if (diffLat < 0.1 || diffLon < 0.1) {
        diffLat = 0.1
        diffLon = 0.1
      }
      this.$store.commit("setNewMapRegion", {
        centerLat: centerLat,
        centerLon: centerLon,
        diffLat: diffLat,
        diffLon: diffLon,
      })
    },
    showAnnotationDetails(annotation) {
      this.$store.commit("setShowAnnotationDetails", annotation)
    },
    removeAnnotationDetails() {
      this.$store.commit("setShowAnnotationDetails", null)
    },
    getCenterCoord(locPoints) {
      var x = 0.0
      var y = 0.0
      var z = 0.0
      for (let i = 0; i < locPoints.length; i++) {
        let lat = toRad(locPoints[i].latitude)
        let lon = toRad(locPoints[i].longitude)

        x += Math.cos(lat) * Math.cos(lon)
        y += Math.cos(lat) * Math.sin(lon)
        z += Math.sin(lat)
      }
      x = x / locPoints.length
      y = y / locPoints.length
      z = z / locPoints.length

      let resultLon = Math.atan2(y, x)
      let resultHyp = Math.sqrt(x * x + y * y)
      let resultLat = Math.atan2(z, resultHyp)
      let result = new mapkit.Coordinate(toDeg(resultLat), toDeg(resultLon))
      return result
    },
    updateStopComments(stop_id, value) {
      this.$store.dispatch("updateStopComments", { stop_id: stop_id, value: value })
    },
    hasNearbyStops(coordinate) {
      let stopFound = false

      if (this.$store.state.activeTrip != null && this.$store.state.activeTrip.stops.length > 0) {
        for (let i = 0; i < this.$store.state.activeTrip.stops.length; i++) {
          if (determineDistanceBetweenTwoPoints(coordinate, this.$store.state.activeTrip.stops[i].coordinate) < 10) {
            stopFound = true
            break
          }
        }
      }
      return stopFound
    },
  },
}
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
button.annotation-callout-button {
  font-size: 0.6rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  border-radius: 0.25rem;
}
textarea.stop-comments {
  width: 15rem;
  height: 5rem;
  margin-top: 0.5rem;
  display: none;
}
</style>
