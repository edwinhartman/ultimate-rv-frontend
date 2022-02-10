import axios from "axios"

export function getCOEParks(region, callback) {
  var annotations = []
  var markers = []

  let lowLatitude = region.center.latitude - region.span.latitudeDelta / 2
  let highLatitude = region.center.latitude + region.span.latitudeDelta / 2
  let lowLongitude = region.center.longitude - region.span.longitudeDelta / 2
  let highLongitude = region.center.longitude + region.span.longitudeDelta / 2
  let url = process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getCOEParks"
  axios({
    method: "post",
    url: url,
    data: {
      lowLatitude: lowLatitude,
      highLatitude: highLatitude,
      lowLongitude: lowLongitude,
      highLongitude: highLongitude,
    },
  })
    .then((res) => {
      for (let i = 0; i < res.data.coe_parks.length; i++) {
        var calloutDelegate = {
          calloutElementForAnnotation: function (annotation) {
            //console.log(annotation);
            var element = document.createElement("div")
            element.className = "tooltip-popup"
            var title = element.appendChild(document.createElement("h3"))
            title.textContent = annotation.title

            if (res.data.coe_parks[i].url != null && res.data.coe_parks[i].url != "") {
              var details = element.appendChild(document.createElement("div"))
              details.className = "text-tiny"
              details.innerHTML = "<a href='" + res.data.coe_parks[i].url + "' target='_blank'>Visit Website</a>"
            }
            var btn = element.appendChild(document.createElement("button"))
            btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
            btn.textContent = "Add To Trip"
            btn.onclick = function () {
              window.mymapview.addToTripNotPlace(
                res.data.coe_parks[i].name + " Park",
                res.data.coe_parks[i].fullAddress,
                res.data.coe_parks[i].location.latitude,
                res.data.coe_parks[i].location.longitude
              )
            }

            return element
          },
        }

        const annotation = new mapkit.MarkerAnnotation(
          new mapkit.Coordinate(res.data.coe_parks[i].location.latitude, res.data.coe_parks[i].location.longitude),
          {
            title: res.data.coe_parks[i].name + " Park",
            subtitle: res.data.coe_parks[i].fullAddress,
            //glyphText: res.data.nps[i].name,
            glyphImage: {
              1: "../static/national-park-icon.png",
            },
            color: "#8e8e93",
            displayPriority: 1000,
            //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
            callout: calloutDelegate,
          }
        )
        const marker = {
          title: res.data.coe_parks[i].name + " Park",
          address: res.data.coe_parks[i].fullAddress,
          coordinate: {
            latitude: res.data.coe_parks[i].location.latitude,
            longitude: res.data.coe_parks[i].location.longitude,
          },
          contents: "",
        }
        annotations.push(annotation)
        markers.push(marker)
      }

      callback(annotations, markers)
    })
    .catch((err) => {
      console.log(err)
    })
}
