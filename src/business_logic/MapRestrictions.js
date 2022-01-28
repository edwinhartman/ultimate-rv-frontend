import axios from "axios"

export function getMapRestrictions(region, height, callback) {
  //   console.log(region.span.latitudeDelta)
  if (region.span.latitudeDelta < 1.0) {
    let lowLatitude = region.center.latitude - region.span.latitudeDelta / 2
    let highLatitude = region.center.latitude + region.span.latitudeDelta / 2
    let lowLongitude = region.center.longitude - region.span.longitudeDelta / 2
    let highLongitude = region.center.longitude + region.span.longitudeDelta / 2

    let max_height = 0
    if (height != null) {
      max_height = height.feet * 12
      max_height += height.inch
    }

    axios({
      url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/map/getRestrictions",
      method: "post",
      data: {
        min_latitude: lowLatitude,
        max_latitude: highLatitude,
        min_longitude: lowLongitude,
        max_longitude: highLongitude,
        max_height: max_height,
      },
    }).then((res) => {
      if (res.data.clearances.length > 0) {
        let annotations = []
        for (let i = 0; i < res.data.clearances.length; i++) {
          let ft = parseInt(res.data.clearances[i].min_height / 12)
          let inch = res.data.clearances[i].min_height - ft * 12

          let txt_to_show = ""
          if (res.data.clearances[i].min_height == 999999) {
            txt_to_show = res.data.clearances[i].combo_max_weight + " LBS"
          } else {
            txt_to_show = ft + "' " + inch + '"'
          }
          const annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(
              res.data.clearances[i].coordinate.latitude,
              res.data.clearances[i].coordinate.longitude
            ),
            {
              title: txt_to_show,
              subtitle: "",
              //glyphText: priceToShow,
              glyphImage: {
                1: "/static/bridge-clearance.png",
              },
              color: "#ff0000",
              displayPriority: 1000,
              //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
              callout: null,
            }
          )
          annotations.push(annotation)
        }
        callback(annotations)
      } else {
        callback([])
      }
    })
  } else {
    callback([])
  }
}
