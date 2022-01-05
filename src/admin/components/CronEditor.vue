<template>
  <div>
    <AdminTabs v-model="active">
      <AdminTab title="Minutely" @activated="resetForMinutely">
        <div class="tab_content">
          Every <input type="text" v-model="minutes" /> minute(s)
        </div>
      </AdminTab>
      <AdminTab title="Hourly" @activated="resetForHourly">
        <div class="tab_content">
          Every <input type="text" v-model="hours" /> hour(s) on minute
          <input type="text" v-model="minutes" />
        </div>
      </AdminTab>
      <AdminTab title="Daily" @activated="resetForDaily">
        <div class="tab_content">
          Every <input type="text" v-model="days" /> day(s) at
          <CronTimePicker @updated="selectedTimeUpdated" />
        </div>
      </AdminTab>
      <AdminTab title="Weekly" @activated="resetForWeekly">
        <div class="tab_content">
          Every <CronWeekOfDayPicker @updated="selectedWeekdaysUpdated" /> at
          <CronTimePicker @updated="selectedTimeUpdated" />
        </div>
      </AdminTab>
      <AdminTab title="Monthly" @activated="resetForMonthly">
        <div class="tab_content">
          On day # <input type="text" v-model="days" /> of every
          <input type="text" v-model="months" /> month(s) at <CronTimePicker />
        </div>
      </AdminTab>
    </AdminTabs>
    <div class="crontime">CRON Time: {{ cronTime }}</div>
  </div>
</template>
<script>
import { ref } from "@vue/reactivity";
import AdminTab from "./AdminTab.vue";
import AdminTabs from "./AdminTabs.vue";
import CronTimePicker from "./CronTimePicker.vue";
import CronWeekOfDayPicker from "./CronWeekOfDayPicker.vue";

export default {
  name: "CronEditor",
  components: {
    AdminTab,
    AdminTabs,
    CronTimePicker,
    CronWeekOfDayPicker,
  },
  props:{
    existingTime:Object
  },
  data() {
    return {
      minutes: 1,
      hours: 0,
      minutesTime: 0,
      hoursTime: 0,
      days: 0,
      time: "00:00",
      weeks: [],
      months: 0,
      cronTime: "*/1 * * * *",
    };
  },
  setup(props) {
    let active = ref(0);
    // console.log(props.existingTime)
    if(props.existingTime.hours != 0){
      active = ref(1)
    }else if (props.existingTime.days != 0){
      active = ref(2)
    }else if (props.existingTime.weeks.length > 0){
      active = ref(3)
    }else if (props.existingTime.months != 0){
      active = ref(4)
    }
    return { active };
  },
  mounted(){
    // console.log(this.existingTime)
    this.minutes = this.existingTime.minutes
    this.hours = this.existingTime.hours
    this.minutesTime = this.existingTime.minutesTime
    this.hoursTime = this.existingTime.hoursTime
    this.days = this.existingTime.days
    this.weeks = this.existingTime.weeks
    this.months = this.existingTime.months
    this.calculateCronTime()
  },
  watch: {
    minutes: function () {
      this.calculateCronTime();
    },
    hours: function () {
      this.calculateCronTime();
    },
    days: function () {
      this.calculateCronTime();
    },
    weeks: function () {
      this.calculateCronTime();
    },
    months: function () {
      this.calculateCronTime();
    },
  },
  methods: {
    resetForMinutely() {
      this.minutes = 1;
      this.hours = 0;
      this.minutesTime = 0;
      this.hoursTime = 0;
      this.days = 0;
      this.weeks = [];
      this.months = 0;
      this.calculateCronTime();
    },
    resetForHourly() {
      this.minutes = 0;
      this.hours = 1;
      this.minutesTime = 0;
      this.hoursTime = 0;
      this.days = 0;
      this.weeks = [];
      this.months = 0;
      this.calculateCronTime();
    },
    resetForDaily() {
      this.minutes = 0;
      this.hours = 0;
      this.minutesTime = 0;
      this.hoursTime = 0;
      this.days = 1;
      this.weeks = [];
      this.months = 0;
      this.calculateCronTime();
    },
    resetForWeekly() {
      this.minutes = 0;
      this.hours = 0;
      this.minutesTime = 0;
      this.hoursTime = 0;
      this.days = 0;
      this.weeks = [];
      this.months = 0;
      this.calculateCronTime();
    },
    resetForMonthly() {
      this.minutes = 0;
      this.hours = 0;
      this.minutesTime = 0;
      this.hoursTime = 0;
      this.days = 0;
      this.weeks = [];
      this.months = 1;
      this.calculateCronTime();
    },
    selectedWeekdaysUpdated(val) {
      this.weeks = [];
      for (let i = 0; i < val.length; i++) {
        this.weeks.push(val[i]);
      }
      this.calculateCronTime();
    },
    selectedTimeUpdated(val) {
      this.hoursTime = parseInt(val.hours);
      this.minutesTime = parseInt(val.minutes);
      this.calculateCronTime();
    },
    calculateCronTime() {
      var c = "";

      if (this.days != 0 || this.hours != 0 || this.hoursTime != 0 || this.minutesTime != 0) {
        c = "" + this.minutesTime;
      } else {
        if (this.minutes != 0) {
          if (this.hours != 0){
            c = "" + this.minutes;
          }else{
            c = "*/" + this.minutes;
          }
        } else {
          c = "*";
        }
      }
      if (this.days != 0 || this.hoursTime != 0 || this.minutesTime != 0) {
        c += " " + this.hoursTime;
      } else {
        if (this.hours != 0) {
          c += " */" + this.hours;
        } else {
          c += " *";
        }
      }
      if (this.days != 0) {
        if (this.months != 0) {
          c += " " + this.days;
        } else {
          c += " */" + this.days;
        }
      } else {
        c += " *";
      }
      if (this.months != 0) {
        c += " */" + this.months;
      } else {
        c += " *";
      }
      if (this.weeks.length == 0) {
        c += " *";
      } else {
        let weekDays = this.weeks.sort();

        for (let i = 0; i < weekDays.length; i++) {
          if (i > 0) {
            c += ",";
          } else {
            c += " ";
          }
          c += weekDays[i];
        }
      }
      this.cronTime = c;
      this.$emit("updated",
        {
          cronTime:this.cronTime,
          minutes:this.minutes,
          hours:this.hours,
          minutesTime:this.minutesTime,
          hoursTime:this.hoursTime,
          days:this.days,
          weeks:this.weeks,
          months:this.months
        })
    },
  },
};
</script>
<style scoped>
* {
  font-size: 0.6rem;
}
.tab_content {
  text-align: left;
  margin-left: 2.5rem;
  display: block-inline;
  width: 40rem;
}
div.crontime {
  text-align: left;
  padding-left: 5rem;
  padding-top: 1rem;
  font-size: 0.7rem;
  font-weight: bold;
}
input {
  width: 2rem;
}
</style>