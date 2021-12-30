import {v4 as uuidv4} from 'uuid'

export function generateCalendarFile(route,callback){
    let events = []
    
    for (let i=0;i<route.stops.length-1;i++){
        if (route.dates[i] != null && route.dates[i] != ""){
            let subject = "Travel"
            let description = "From " + route.stops[i].name + " [" + route.stops[i].formattedAddress + "] \n To " +
              route.stops[i+1].name + " [" + route.stops[i+1].formattedAddress + "]"
            let d = route.dates[i]
            var date = d.substring(0,10).split('-')
            date = date[0] + date[1] + date[2]
            let begin = date
            let end = begin
            let geo = route.stops[i+1].coordinate.latitude + ";" + route.stops[i+1].coordinate.longitude
            let location = route.stops[i+1].name + "\\," + route.stops[i+1].formattedAddress.replace(/,/g,"\\,")
            events.push({
                subject,description,begin,end,geo,location
            })

            if (route.dates[i+1] != null && route.dates[i+1]!=""){
                let d1 = new Date(route.dates[i])
                let d2 = new Date(route.dates[i+1])
                let diffTime = Math.abs(d2-d1)
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                
                if (diffDays > 1){
                    d1.setDate(d1.getDate())
                    d2.setDate(d1.getDate() + diffDays + 1)
                    subject = "Stay at " + route.stops[i+1].name
                    description = ""
                    let d1_txt = d1.toISOString().substr(0,10).split("-")
                    begin = d1_txt[0] + d1_txt[1] + d1_txt[2]
                    let d2_txt = d2.toISOString().substr(0,10).split("-")
                    end = d2_txt[0] + d2_txt[1] + d2_txt[2]
                    geo = route.stops[i+1].coordinate.latitude + ";" + route.stops[i+1].coordinate.longitude
                    location = route.stops[i+1].name + "\\," + route.stops[i+1].formattedAddress.replace(/,/g,"\\,")
                    events.push({
                        subject,description,begin,end,geo,location
                    })

                }else{
                    d1.setDate(d1.getDate())
                    d2.setDate(d1.getDate() + 1)
                    subject = "Overnight at " + route.stops[i+1].name
                    description = ""
                    let d1_txt = d1.toISOString().substr(0,10).split("-")
                    begin = d1_txt[0] + d1_txt[1] + d1_txt[2]
                    let d2_txt = d2.toISOString().substr(0,10).split("-")
                    end = d2_txt[0] + d2_txt[1] + d2_txt[2]
                    geo = route.stops[i+1].coordinate.latitude + ";" + route.stops[i+1].coordinate.longitude
                    location = route.stops[i+1].name + "\\," + route.stops[i+1].formattedAddress.replace(/,/g,"\\,")
                    events.push({
                        subject,description,begin,end,geo,location
                    })
                }
            }
        }
    }
    let now = new Date()
    let nowTxt = now.toISOString().replace(/-/g,"").replace(/:/g,"")
    nowTxt = nowTxt.substr(0,nowTxt.indexOf("."))
    let output = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//beyondthedestination.com//Ultimate RV Calendar 1.0//EN\n"
    for (let i=0;i<events.length;i++){
        output += "BEGIN:VEVENT\n" +
            "UID:" + uuidv4() + "\n" + 
            "DTSTAMP:" +  nowTxt + "\n" +
            "DTSTART:" + events[i].begin + "\n" +
            "DTEND:" + events[i].end + "\n" +
            "GEO:" + events[i].geo + "\n" +
            "LOCATION:" + events[i].location + "\n" + 
            "CATEGORIES:TRAVEL\n" +
            "STATUS:CONFIRMED\n" + 
            "TRANSP:TRANSPARENT\n" +
            "SUMMARY:" + events[i].subject + "\n" + 
            "DESCRIPTION:" + events[i].description + "\n" +
            "END:VEVENT\n"

    }
    output += "END:VCALENDAR"
    callback(output)
}
