<template>
  <div class="calendar-main">
    <button class="all-trips" @click="showAllTrips()">{{ showingAllTrips? "Show Active Trip" :"Show All Trips" }}</button>
    <button class="download" @click="downloadCalendar()">Download Active Trip Calendar</button>
    <!-- <div class="title">Trip Calendar</div> -->
    <div class="month-header">
      <div @click="monthIndex--;generateCalendar()">&lt;&lt;</div>
      <div class="month-name">{{ calendarMonth }} {{ yearIndex }}</div>
      <div @click="monthIndex++;generateCalendar()">&gt;&gt;</div>
    </div>
    <div class="calendar-grid">
        <div class="day-of-week">Sunday</div>
        <div class="day-of-week">Monday</div>
        <div class="day-of-week">Tuesday</div>
        <div class="day-of-week">Wednesday</div>
        <div class="day-of-week">Thursday</div>
        <div class="day-of-week">Friday</div>
        <div class="day-of-week">Saturday</div>
      <div v-for="day in calendarDays" :key="day.id" class="calendar-day" :class="day.txt == '' ? 'dont-show' : ''">
        <div class="date-day">{{ day.txt }}</div>
        <div class="day-spacer"></div>
        <div v-if="events.length > 0">
        <div v-for="bar in getEvents(day.txt)" :key="bar" class="calendar-entry" :class="bar.daytrip ? 'calendar-entry-daytrip':bar.staystart?'calendar-entry-stay-start':bar.stayend?'calendar-entry-stay-end':bar.stay?'calendar-entry-stay':'calendar-entry-travel'">{{bar.txt}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { generateCalendarFile } from "../business_logic/CalendarFiles"
export default {
  name: "CalendarView",
  data() {
    return {
      calendarDays: [],
      calendarMonth: "",
      monthIndex: 0,
      yearIndex:0,
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      events:[],
      showingAllTrips:false
    }
  },
  mounted() {
    let date = new Date()
    this.monthIndex = date.getMonth()
    this.yearIndex = date.getFullYear()
    if (this.$store.state.activeTrip.dates.length > 0){
        for (let i=0;i<this.$store.state.activeTrip.dates.length;i++){
            if (this.$store.state.activeTrip.dates[i] != ""){
                let date2 = new Date(this.$store.state.activeTrip.dates[i])
                this.monthIndex = date2.getMonth()
                this.yearIndex = date2.getFullYear()
                break
            }
        }
        generateCalendarFile(this.$store.state.activeTrip,false,(events)=>{
            this.events = events
        })
    }
    this.generateCalendar()
  },
  methods: {
    generateCalendar() {
        if (this.monthIndex < 0){
            this.monthIndex = 11
            this.yearIndex--
        }else if (this.monthIndex > 11){
            this.monthIndex = 0
            this.yearIndex++
        }
      this.calendarDays = []
      let date = new Date()
      date.setFullYear(this.yearIndex,this.monthIndex,1)
      this.calendarMonth = this.monthNames[this.monthIndex]
      let totalDayCnt = 0
      for (let i = 0; i < date.getDay(); i++) {
        this.calendarDays.push({id:Math.random() * 10000,txt:""})
        totalDayCnt++
      }
      let nextMonthStart = new Date()
      nextMonthStart.setFullYear(this.yearIndex,date.getMonth() + 1,1)
      

      while (date < nextMonthStart) {
        this.calendarDays.push({id:Math.random() * 10000,txt:date.getDate() + ""})
        date.setDate(date.getDate() + 1)
        totalDayCnt++
      }

      for (let i = totalDayCnt + 1; i < 36; i++) {
        this.calendarDays.push({id:Math.random() * 10000,txt:""})
      }
    },
    getEvents(day){
        let dayEvents = []
        let date = new Date(this.yearIndex,this.monthIndex,day)
        
        for (let i=0;i<this.events.length;i++){
            if (this.yyyymmdd(this.events[i].beginDT) == this.yyyymmdd(date)){
                if (this.events[i].type == "daytrip"){
                    dayEvents.push({txt:this.events[i].subject,daytrip:true,staystart:false,stayend:false,stay:false})
                }else if (this.events[i].type == "travel"){
                    dayEvents.push({txt:this.events[i].subject,daytrip:false,staystart:false,stayend:false,stay:false})
                }else if (this.events[i].type == "stay"){
                    dayEvents.push({txt:this.events[i].subject,daytrip:false,staystart:true,stayend:false,stay:false})
                }
            }else if (this.yyyymmdd(this.events[i].endDT) == this.yyyymmdd(date)){
                if (this.events[i].type == "stay"){
                    dayEvents.push({txt:this.events[i].subject,daytrip:false,staystart:false,stayend:true,stay:false})
                }
            }else {
                let begin2 = this.yyyymmdd(this.events[i].beginDT)
                let end2 = this.yyyymmdd(this.events[i].endDT)
                let start = new Date(parseInt(begin2.substring(0,4)),parseInt(begin2.substring(4,6))-1,parseInt(begin2.substring(6,8)))
                let end = new Date(parseInt(end2.substring(0,4)),parseInt(end2.substring(4,6))-1,parseInt(end2.substring(6,8)))
                if (date > start && date < end && this.events[i].type == "stay"){
                    dayEvents.push({txt:this.events[i].subject,daytrip:false,staystart:false,stayend:false,stay:true})
                }
            }
        }

        return dayEvents
    },
    yyyymmdd(x) {
        var y = x.getFullYear().toString();
        var m = (x.getMonth() + 1).toString();
        var d = x.getDate().toString();
        (d.length == 1) && (d = '0' + d);
        (m.length == 1) && (m = '0' + m);
        var yyyymmdd = y + m + d;
        return yyyymmdd;
    },
    showAllTrips(){
        this.showingAllTrips = !this.showingAllTrips
        generateCalendarFile(this.showingAllTrips?null:this.$store.state.activeTrip,false,(events)=>{
            this.events = events
        })
    },
    downloadCalendar(){
        generateCalendarFile(this.$store.state.activeTrip,true, (txt) => {
          window.open("data:text/calendar;charset=utf8," + escape(txt))
        })
    }
  },
}
</script>
<style scoped>
.calendar-main {
  width: 65rem;
  height: 55rem;
  position:relative;
  margin-top:0.25rem;
}
.title {
  font-weight: bold;
  font-size: 1.2rem;
}
.calendar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.calendar-day {
  width: 8rem;
  height: 8rem;
  background-color: rgb(247, 247, 247);
  border-radius: 0.5rem;
  box-shadow: 0.2rem 0.2rem 0.5rem rgba(43, 43, 43, 0.2);
  margin: 0.2rem;
  position: relative;
  z-index:8;
  display:flex;
  flex-direction: column;
}
.date-day {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  font-size: 0.8rem;
  z-index:10;
}
.dont-show {
  opacity: 0;
}
.month-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  width:10rem;
}
.month-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  user-select:none;
}
.month-header > div {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.month-header > div:nth-child(1),.month-header > div:nth-child(3){
    cursor: pointer;
}
.day-of-week{
    font-size:0.7rem;
    font-style: italic;
}
.day-spacer{
    width:100%;
    height:1.35rem;
    background-color: red;
    opacity: 0;
    z-index:9;
}
.calendar-entry{
    font-size:0.65rem;
    /* width:95%; */
    text-align: left;
    margin-left:0.2rem;
    margin-right:0.2rem;
    padding-left:0.2rem;
    padding-right:0.2rem;
    background-color: red;
    color:white;
    margin-top:0.1rem;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(80,80,80,0.5);
}
.calendar-entry-stay-start{
    border-radius: 0.25rem  0  0 0.25rem;
    background-color: blue;
}
.calendar-entry-stay-end{
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: blue;
}
.calendar-entry-stay{
    background-color: blue;
}
.calendar-entry-travel{
    border-radius: 0.25rem;
}
.calendar-entry-daytrip{
    border-radius: 0.25rem;
    background-color: purple;

}
button.all-trips{
    position:absolute;
    right:0;
    font-size:0.65rem;
    cursor: pointer;
}
button.download{
    position:absolute;
    left:0;
    /* top:1.25rem; */
    font-size:0.65rem;
    cursor: pointer;
}
</style>
