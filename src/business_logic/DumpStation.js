import axios from 'axios'

export function searchDumpStations(region,store, zipcode, callback) {
    var annotations = []
    var markers = []
    let lowLatitude = region.center.latitude - region.span.latitudeDelta
    let highLatitude = region.center.latitude + region.span.latitudeDelta
    let lowLongitude = region.center.longitude - region.span.longitudeDelta
    let highLongitude = region.center.longitude + region.span.longitudeDelta

    axios({
        method: "post",
        url:
            process.env.VUE_APP_BACKEND_CONNECTION_URI +
            "/getDumpStations",
        data: {
            zipcode,
            lowLatitude: lowLatitude,
            highLatitude: highLatitude,
            lowLongitude: lowLongitude,
            highLongitude: highLongitude
        },
    })
        .then((res) => {
            //callback(annotations)
            //console.log(res)

            for (let i = 0; i < res.data.data.length; i++) {

                var calloutDelegate = {
                    calloutElementForAnnotation: function (annotation) {
                        //console.log(annotation);
                        var element = document.createElement("div");
                        element.className = "tooltip-popup";
                        var title = element.appendChild(
                            document.createElement("h3")
                        );
                        title.textContent = annotation.title;

                        var details = element.appendChild(
                            document.createElement("div")
                        );
                        if (res.data.data[i].details.length > 0) {
                            var detailsTxt = "<div  style='text-align:left;'><ul style='font-size:10px;'>"
                            
                            for (let j = 0; j < res.data.data[i].details.length; j++) {
                                detailsTxt += "<li>" + res.data.data[i].details[j] + "</li>"
                            }
                            detailsTxt += "</ul></div>"
                            details.innerHTML = detailsTxt
                        }

                        var btn = element.appendChild(
                            document.createElement("button")
                        );
                        
                        btn.className = "bg-blue-500 text-white rounded-md pl-1 pr-1 text-tiny"
                        btn.textContent = "Add To Route";
                        btn.onclick = function () {
                            window.mymapview.addToRouteNotPlace(
                                res.data.data[i].name,
                                "",
                                res.data.data[i].latitude,
                                res.data.data[i].longitude
                            );
                        };

                        return element;
                    },
                };

                const annotation = new mapkit.MarkerAnnotation(
                    new mapkit.Coordinate(
                        res.data.data[i].latitude,
                        res.data.data[i].longitude
                    ),
                    {
                        title: res.data.data[i].name,
                        subtitle: "",
                        //glyphText: priceToShow,
                        glyphImage: {
                            1: "/static/dump-station-black-1.png",
                        },
                        color: "#8e8e93",
                        displayPriority: 1000,
                        //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
                        callout: calloutDelegate,
                    }
                );
                var markerDetailsTxt = "<div  style='text-align:left;'><ul style='font-size:10px;'>"
                            
                            for (let j = 0; j < res.data.data[i].details.length; j++) {
                                markerDetailsTxt += "<li>" + res.data.data[i].details[j] + "</li>"
                            }
                            markerDetailsTxt += "</ul></div>"
                const marker = {
                    title:res.data.data[i].name,
                    address:"",
                    coordinate:{
                        latitude:res.data.data[i].latitude,
                        longitude:res.data.data[i].longitude
                    },
                    contents:markerDetailsTxt + "<br>Distance: " + res.data.data[i].distance + " miles",
                    distance:res.data.data[i].distance
                }
                annotations.push(annotation)
                markers.push(marker)
            }
            markers = markers.sort((a,b)=>{return a.distance - b.distance})
            callback(annotations,markers)
        })
        .catch((err) => {
            console.log(err)
        })
}
