class UltimateMarkerAnnotation extends mapkit.MarkerAnnotation{
    constructor(coordinate,annotationDetails,optionalDetails){
        super(coordinate,annotationDetails)
        this.optionalDetails = optionalDetails
    }
}