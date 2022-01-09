import axios from 'axios'

export function getStateParks(region, callback) {
    var annotations = []
    var markers = []

    let lowLatitude = region.center.latitude - (region.span.latitudeDelta /2)
    let highLatitude = region.center.latitude + (region.span.latitudeDelta /2)
    let lowLongitude = region.center.longitude - (region.span.longitudeDelta /2)
    let highLongitude = region.center.longitude + (region.span.longitudeDelta /2)
    let url = process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getStateParks"
    axios({
        method: "post",
        url: url,
        data: {
            lowLatitude: lowLatitude,
            highLatitude: highLatitude,
            lowLongitude: lowLongitude,
            highLongitude: highLongitude
        }
    }).then((res) => {
        for (let i = 0; i < res.data.sps.length; i++) {
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
                    details.style = "font-size:10px;"
                    if (res.data.sps[i].link != null && res.data.sps[i].link != ""){
                        details.innerHTML = "<a target='_blank' href='" + res.data.sps[i].link + "'>Click to visit site</a>"
                    }

                    var btn = element.appendChild(
                        document.createElement("button")
                    );
                    btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
                    btn.textContent = "Add To Trip";
                    btn.onclick = function () {
                        window.mymapview.addToTripNotPlace(
                            res.data.sps[i].name,
                            "",
                            res.data.sps[i].location.latitude,
                            res.data.sps[i].location.longitude
                        );
                    };

                    return element;
                },
            };

            const annotation = new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(
                    res.data.sps[i].location.latitude,
                    res.data.sps[i].location.longitude
                ),
                {
                    title: res.data.sps[i].name,
                    subtitle: "",
                    //glyphText: res.data.nps[i].name,
                    glyphImage: {
                        1: "../static/national-park-icon.png",
                    },
                    color: "#8e8e93",
                    displayPriority: 1000,
                    //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
                    callout: calloutDelegate,
                }
            );
            const marker = {
                title:res.data.sps[i].name,
                address:"",
                coordinate:{
                  latitude:res.data.sps[i].location.latitude,
                  longitude:res.data.sps[i].location.longitude
                },
                contents:"Distance: " + res.data.sps[i].distance + " miles",
                distance:res.data.sps[i].distance
              }
            annotations.push(annotation)
            markers.push(marker)
        }
        markers = markers.sort((a,b)=>{return a.distance - b.distance})
        callback(annotations,markers)
    }).catch((err) => {
        console.log(err)
    })
    
}

