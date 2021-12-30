import {determineDistance} from './HelperLogic'

export function executeMapSearch(region,searchTerm,callback){
    var search = new mapkit.Search({ region: region });
    search.search(searchTerm,(err,data)=>{
        for (let i=0;i<data.places.length;i++){
            let distance = determineDistance(region,data.places[i].coordinate.latitude,data.places[i].coordinate.longitude)
            data.places[i].distance = distance
        }
        //console.log(data.places[0])
        callback(data.places.filter(place => place.distance < 50.0))
    })

}