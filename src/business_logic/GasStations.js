import axios from "axios"

export function searchGasStations(
  region,
  store,
  city,
  state,
  zipcode,
  country,
  alongroute,
  alongRoutePolyline,
  callback
) {
  var annotations = []
  var markers = []
  let lowLatitude = region.center.latitude - region.span.latitudeDelta / 2
  let highLatitude = region.center.latitude + region.span.latitudeDelta / 2
  let lowLongitude = region.center.longitude - region.span.longitudeDelta / 2
  let highLongitude = region.center.longitude + region.span.longitudeDelta / 2

  axios({
    method: "post",
    url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getGasPrices",
    data: {
      city,
      state,
      zipcode,
      country,
      lowLatitude: lowLatitude,
      highLatitude: highLatitude,
      lowLongitude: lowLongitude,
      highLongitude: highLongitude,
      alongroute: alongroute,
      alongRoutePolyline: alongRoutePolyline,
    },
  })
    .then((res) => {
      // console.log(res)
      for (let i = 0; i < res.data.data.length; i++) {
        for (let j = 1; j < res.data.data[i].length; j++) {
          var calloutDelegate = {
            calloutElementForAnnotation: function (annotation) {
              //console.log(annotation);
              var element = document.createElement("div")
              element.className = "tooltip-popup"
              var title = element.appendChild(document.createElement("div"))

              title.className = "text-sm font-bold"
              var imageName = ""
              switch (res.data.data[i][j].displayName) {
                case "Circle K":
                  imageName = "circle-k-logo.png"
                  break
                case "QuikTrip":
                  imageName = "quicktrip-logo.png"
                  break
                case "Murphy Usa":
                  imageName = "murphy-usa-logo.png"
                  break
                case "Shell":
                  imageName = "shell-logo.png"
                  break
                case "Chevron":
                  imageName = "chevron-logo.png"
                  break
                case "Valero":
                  imageName = "valero-logo.png"
                  break
                case "Exxon":
                  imageName = "exxon-logo.png"
                  break
                case "Texaco":
                  imageName = "texaco-logo.png"
                  break
              }
              //title.textContent = annotation.title;
              if (imageName != "") {
                title.innerHTML =
                  "<img class='w-4 inline pr-2' src='/static/" +
                  imageName +
                  "' /><div class='ml-1 inline'>" +
                  annotation.title +
                  "</div>"
              } else {
                title.innerHTML = annotation.title
              }

              var details = element.appendChild(document.createElement("div"))
              details.innerHTML =
                "<table style='font-size:8px;text-align:left;'><tr><td>Regular</td><td>" +
                res.data.data[i][j].regPrice +
                "</td><td>" +
                res.data.data[i][j].regDate +
                "</td></tr>" +
                "<tr><td>Midgrade</td><td>" +
                res.data.data[i][j].midPrice +
                "</td><td>" +
                res.data.data[i][j].midDate +
                "</td></tr>" +
                "<tr><td>Premium</td><td>" +
                res.data.data[i][j].premPrice +
                "</td><td>" +
                res.data.data[i][j].premDate +
                "</td></tr>" +
                "<tr><td>Diesel</td><td>" +
                res.data.data[i][j].diesPrice +
                "</td><td>" +
                res.data.data[i][j].diesDate +
                "</td></tr>" +
                "</table>"

              var btn = element.appendChild(document.createElement("button"))
              btn.className = "text-tiny bg-blue-600 text-white pl-1 pr-1 mr-1 rounded-md inline"
              btn.textContent = "Add To Trip"
              btn.onclick = function () {
                window.mymapview.addToTripNotPlace(
                  res.data.data[i][j].displayName,
                  res.data.data[i][j].formattedAddress,
                  Number(res.data.data[i][j].latitude),
                  Number(res.data.data[i][j].longitude)
                )
              }
              var btn2 = element.appendChild(document.createElement("button"))
              btn2.className = "text-tiny bg-blue-600 text-white pl-1 pr-1 mr-1 rounded-md inline"
              btn2.textContent = "Zoom To Location"
              btn2.onclick = function () {
                window.mymapview.zoomToLocation(
                  Number(res.data.data[i][j].latitude),
                  Number(res.data.data[i][j].longitude)
                )
              }

              return element
            },
          }
          var priceToShow = ""
          switch (store.state.activeRV.fueltype) {
            case "regular":
              priceToShow = res.data.data[i][j].regPrice
              break
            case "midgrade":
              priceToShow = res.data.data[i][j].midPrice
              break
            case "premium":
              priceToShow = res.data.data[i][j].premPrice
              break
            case "diesel":
              priceToShow = res.data.data[i][j].diesPrice
              break
          }
          const annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(Number(res.data.data[i][j].latitude), Number(res.data.data[i][j].longitude)),
            {
              title: res.data.data[i][j].displayName,
              subtitle: res.data.data[i][j].formattedAddress,
              glyphText: priceToShow,
              glyphImage: {
                1: "/static/gas-station-black.png",
              },
              color: "#8e8e93",
              displayPriority: 1000,
              //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
              callout: calloutDelegate,
            }
          )
          var imageName = ""
          switch (res.data.data[i][j].displayName) {
            case "Circle K":
              imageName = "circle-k-logo.png"
              break
            case "QuikTrip":
              imageName = "quicktrip-logo.png"
              break
            case "Murphy Usa":
              imageName = "murphy-usa-logo.png"
              break
            case "Shell":
              imageName = "shell-logo.png"
              break
            case "Chevron":
              imageName = "chevron-logo.png"
              break
            case "Valero":
              imageName = "valero-logo.png"
              break
            case "Exxon":
              imageName = "exxon-logo.png"
              break
            case "Texaco":
              imageName = "texaco-logo.png"
              break
          }
          const marker = {
            title: res.data.data[i][j].displayName,
            address: res.data.data[i][j].formattedAddress,
            coordinate: {
              latitude: Number(res.data.data[i][j].latitude),
              longitude: Number(res.data.data[i][j].longitude),
            },
            contents:
              "<table style='font-size:8px;text-align:left;'><tr><td>Regular</td><td>" +
              res.data.data[i][j].regPrice +
              "</td><td>" +
              res.data.data[i][j].regDate +
              "</td></tr>" +
              "<tr><td>Midgrade</td><td>" +
              res.data.data[i][j].midPrice +
              "</td><td>" +
              res.data.data[i][j].midDate +
              "</td></tr>" +
              "<tr><td>Premium</td><td>" +
              res.data.data[i][j].premPrice +
              "</td><td>" +
              res.data.data[i][j].premDate +
              "</td></tr>" +
              "<tr><td>Diesel</td><td>" +
              res.data.data[i][j].diesPrice +
              "</td><td>" +
              res.data.data[i][j].diesDate +
              "</td></tr>" +
              "</table>Distance: " +
              res.data.data[i][j].distance +
              " miles",
            distance: res.data.data[i][j].distance,
            type: "gasstation",
            img: imageName,
          }
          annotations.push(annotation)
          markers.push(marker)
        }
      }
      markers = markers.sort((a, b) => {
        return a.distance - b.distance
      })
      callback(annotations, markers)
    })
    .catch((err) => {
      console.log(err)
    })
}
