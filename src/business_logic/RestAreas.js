import axios from "axios"

export function getRestAreas(region, callback) {
  //"{\"categories\":\"reststops\",\"location\":{\"latitude\":\(region.center.latitude),\"longitude\":\(region.center.longitude)}}"
  axios({
    url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getYelpCategory",
    method: "POST",
    data: {
      categories: "reststops",
      location: { latitude: region.center.latitude, longitude: region.center.longitude },
    },
  }).then((res) => {
    // console.log(res)
    var annotations = []
    var markers = []
    for (let i = 0; i < res.data.data.length; i++) {
      var calloutDelegate = {
        calloutElementForAnnotation: function (annotation) {
          var element = document.createElement("div")
          element.className = "tooltip-popup"
          var title = element.appendChild(document.createElement("div"))
          title.className = "font-bold text-tiny"
          title.textContent = annotation.title
          var note = element.appendChild(document.createElement("div"))
          note.className = "text-ultratiny"
          note.innerHTML = "Check with the business manager to see if overnight parking is available."

          var btn = element.appendChild(document.createElement("button"))
          btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
          btn.textContent = "Add To Trip"
          btn.onclick = function () {
            window.mymapview.addToTripNotPlace(
              res.data.data[i].name,
              res.data.data[i].location.address1 +
                " " +
                res.data.data[i].location.city +
                "," +
                res.data.data[i].location.state +
                " " +
                res.data.data[i].location.zip_code,
              res.data.data[i].coordinates.latitude,
              res.data.data[i].coordinates.longitude
            )
          }

          return element
        },
      }

      const annotation = new mapkit.MarkerAnnotation(
        new mapkit.Coordinate(res.data.data[i].coordinates.latitude, res.data.data[i].coordinates.longitude),
        {
          title: res.data.data[i].name,
          subtitle:
            res.data.data[i].location.address1 +
            " " +
            res.data.data[i].location.city +
            "," +
            res.data.data[i].location.state +
            " " +
            res.data.data[i].location.zip_code,
          glyphText: res.data.data[i].name,

          color: "#8e8e93",
          displayPriority: 1000,
          callout: calloutDelegate,
        }
      )
      const marker = {
        title: res.data.data[i].name,
        address:
          res.data.data[i].location.address1 +
          " " +
          res.data.data[i].location.city +
          "," +
          res.data.data[i].location.state +
          " " +
          res.data.data[i].location.zip_code,
        coordinate: {
          latitude: res.data.data[i].coordinates.latitude,
          longitude: res.data.data[i].coordinates.longitude,
        },
        contents: "",
        distance: 0,
      }

      annotations.push(annotation)
      markers.push(marker)
    }
    callback(annotations, markers)
  })
}
