import { executeMapSearch } from "./MapSearch"

export function getOvernightParking(region,callback){
    var terms = ["walmart","cabellas","dennys","IHOP","Holilday Inn","Marriot Inn","Target","Winco","Safeway","QFC"]
    var allAnnotations = []
    var markers = []
    var searchCompleted = 0
    for (let i=0;i<terms.length;i++){
        executeMapSearch(region,terms[i],(places)=>{
            for (let j=0;j<places.length;j++){
                var calloutDelegate = {
                    calloutElementForAnnotation: function (annotation) {
                        //console.log(annotation);
                        var element = document.createElement("div");
                        element.className = "tooltip-popup";
                        var title = element.appendChild(
                            document.createElement("div")
                        );
                        title.className = "font-bold text-tiny"
                        title.textContent = annotation.title;
                        var note = element.appendChild(
                            document.createElement("div"))
                        note.className = "text-ultratiny"
                        note.innerHTML = "Check with the business manager to see if overnight parking is available."

                        if (places[j].urls != null && places[j].urls.length > 0){
                        var details = element.appendChild(
                            document.createElement("div")
                        );
                        details.className = "text-tiny inline align-middle mr-2 pl-1 pr-1 bg-blue-500 rounded-md text-white"
                        details.innerHTML = "<a href='" + places[j].urls[0] + "' target='_blank'>Visit Website</a>"
                        }
                        if (places[j].telephone != null && places[j].telephone.length > 0){
                            var phone = element.appendChild(document.createElement("div"))
                            phone.classList = "text-tiny inline align-middle mr-2 pl-3 pr-3 bg-blue-500 rounded-md text-white"
                            phone.innerHTML = "<a href='tel://" + places[j].telephone + "'>Call</a>"
                        }
                        var btn = element.appendChild(
                            document.createElement("button")
                        );
                        btn.className = "text-tiny bg-blue-500 align-middle pl-1 pr-1 text-white rounded-md"
                        btn.textContent = "Add To Trip";
                        btn.onclick = function () {
                            window.mymapview.addToTripNotPlace(
                                places[j].name,
                                places[j].formattedAddress,
                                places[j].coordinate.latitude,
                                places[j].coordinate.longitude
                            );
                        };
    
                        return element;
                    },
                };
    
                const annotation = new mapkit.MarkerAnnotation(
                    places[j].coordinate,
                    {
                        title: places[j].name,
                        subtitle: places[j].formattedAddress,
                        glyphText: places[j].name,
                        
                        color: "#8e8e93",
                        displayPriority: 1000,
                        //callout:data.places[i].urls.length > 0 ? calloutDelegate:null
                        callout: calloutDelegate,
                    }
                );
                const marker = {
                    title:places[j].name,
                    address:places[j].formattedAddress,
                    coordinate:{
                      latitude:places[j].coordinate.latitude,
                      longitude:places[j].coordinate.longitude
                    },
                    contents:"<div class='text-red-600'>Call business manager for verification.</div><br>Distance: " + places[j].distance + " miles",
                    distance:places[j].distance
                  }

                allAnnotations.push(annotation)
                markers.push(marker)
            }
            searchCompleted++
            if (searchCompleted == terms.length){
                markers = markers.sort((a,b)=>{return a.distance - b.distance})
                callback(allAnnotations,markers)
            }
        })
    }
}