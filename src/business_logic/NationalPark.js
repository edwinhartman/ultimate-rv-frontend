import axios from 'axios'

export function getNationalParks(region,callback){
    var annotations = []
    var markers = []
    let lowLatitude = region.center.latitude - region.span.latitudeDelta
    let highLatitude = region.center.latitude + region.span.latitudeDelta
    let lowLongitude = region.center.longitude - region.span.longitudeDelta
    let highLongitude = region.center.longitude + region.span.longitudeDelta

    let url = process.env.VUE_APP_BACKEND_CONNECTION_URI + "/getNationalParks"
    
    axios({
      method: "post",
      url:url,
      data: {
        lowLatitude: lowLatitude,
        highLatitude: highLatitude,
        lowLongitude: lowLongitude,
        highLongitude: highLongitude
    }
        }).then((res)=>{

            for (let i=0;i<res.data.nps.length;i++){
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
                        let idx = annotation.subtitle.indexOf("<a")
                        if (idx > -1){
                            let idx2 = annotation.subtitle.indexOf(">",idx)
                            details.innerHTML = annotation.subtitle.substr(0,idx2) + " target='_blank'" +
                                annotation.subtitle.substr(idx2)
                        }else{
                            details.innerHTML = annotation.subtitle;
                        }

                        var btn = element.appendChild(
                            document.createElement("button")
                        );

                        btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
                        btn.textContent = "Add To Route";
                        btn.onclick = function () {
                            window.mymapview.addToRouteNotPlace(
                                res.data.nps[i].name,
                                "",
                                res.data.nps[i].location.latitude,
                                res.data.nps[i].location.longitude
                            );
                        };

                        return element;
                    },
                };

                const annotation = new mapkit.MarkerAnnotation(
                    new mapkit.Coordinate(
                        res.data.nps[i].location.latitude,
                        res.data.nps[i].location.longitude
                    ),
                    {
                        title: res.data.nps[i].name,
                        subtitle: res.data.nps[i].description,
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
                    title:res.data.nps[i].name,
                    address:"",
                    coordinate:{
                      latitude:res.data.nps[i].location.latitude,
                      longitude:res.data.nps[i].location.longitude
                    },
                    contents:"Distance: " + res.data.nps[i].distance + " miles",
                    distance:res.data.nps[i].distance
                  }

                annotations.push(annotation)
                markers.push(marker)
            }
            markers = markers.sort((a,b)=>{return a.distance - b.distance})
            callback(annotations,markers)
        }).catch((err)=>{
            console.log(err)
        })
}