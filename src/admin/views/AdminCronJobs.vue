<template>
  <div class="main_div">
    <div v-if="jobs.length == 0">No jobs configured</div>
    <table v-if="jobs.length > 0">
      <tr>
        <td>Name</td>
        <td>Task</td>
        <td>CRON Time</td>
        <td>Enabled</td>
        <td>Last Completed</td>
      </tr>
      <tr
        v-for="(job, idx) in jobs"
        :key="job._id"
        @click="editExistingJob(idx)"
        :class="job.enabled ? 'active-job' : 'inactive-job'"
      >
        <td>{{ job.title }}</td>
        <td>{{ job.task.name }}</td>
        <td>{{ job.cronTime }}</td>
        <td>{{ job.enabled }}</td>
        <td>{{ getDateTimeFormatted(job.updated_dttm) }}</td>
      </tr>
    </table>
    <button @click="addNewCronJob">Add New CRON Job</button>

    <div v-if="addEditFormVisible" class="add-edit-form">
      <div>Title: <input type="text" v-model="title" /></div>
      <div>
        Task Name:
        <select name="" id="" v-model="selectedTask">
          <option v-for="task in tasks" :key="task._id" :value="task._id">
            {{ task.name }}
          </option>
        </select>
      </div>
      <div>
        Enabled: <input type="checkbox" name="" id="" v-model="enabled" />
      </div>
      <div>
        Time: {{ jobTime.cronTime }}
        <CronEditor @updated="updateTime" :existingTime="jobTime" />
      </div>
      <div>
        <button class="save-button" @click="saveJob">Save</button>
        <button class="cancel-button" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
import CronEditor from "../components/CronEditor.vue";
import axios from "axios";

export default {
  name: "AdminCronJobs",
  components: {
    CronEditor,
  },
  data() {
    return {
      jobs: [],
      tasks: [],
      addEditFormVisible: false,
      jobTime: {
        cronTime: "",
      },
      id: null,
      title: "",
      enabled: true,
      selectedTask: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      axios({
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getCronTasks",
        method: "get",
      }).then((res) => {
        this.tasks = res.data.tasks;
      });
      axios({
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getCronJobs",
        method: "get",
      }).then((res) => {
        this.jobs = res.data.jobs;
      });
    },
    addNewCronJob() {
      this.id = null;
      this.title = "";
      this.selectedTask = null;
      this.enabled = true;
      this.jobTime = {
        cronTime: "* * * * *",
        minutes: 1,
        hours: 0,
        minutesTime: 0,
        hoursTime: 0,
        days: 0,
        weeks: [],
        months: 0,
      };
      this.addEditFormVisible = true;
    },
    editExistingJob(idx) {
      this.id = this.jobs[idx]._id;
      this.title = this.jobs[idx].title;
      this.selectedTask = this.jobs[idx].task._id;
      this.enabled = this.jobs[idx].enabled;
      this.jobTime = {
        cronTime: this.jobs[idx].cronTime,
        minutes: this.jobs[idx].humanTime.minutes,
        hours: this.jobs[idx].humanTime.hours,
        minutesTime: this.jobs[idx].humanTime.minutesTime,
        hoursTime: this.jobs[idx].humanTime.hoursTime,
        days: this.jobs[idx].humanTime.days,
        weeks: this.jobs[idx].humanTime.weeks,
        months: this.jobs[idx].humanTime.months,
      };
      this.addEditFormVisible = true;
    },
    cancel() {
      this.addEditFormVisible = false;
    },
    updateTime(val) {
      // console.log(val)
      this.jobTime = val;
    },
    saveJob() {
      this.addEditFormVisible = false;
      axios({
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/saveCronJob",
        method: "post",
        data: {
          id: this.id,
          title: this.title,
          task_id: this.selectedTask,
          enabled: this.enabled,
          time: this.jobTime,
        },
      }).then((res) => {
        this.jobs = res.data.jobs;
        axios({
          url:
            process.env.VUE_APP_BACKEND_CONNECTION_URI +
            "/admin/resetBackgroundJobs",
          method: "get",
        }).then((res) => {});
      });
    },
    getDateTimeFormatted(dateTime) {
      if (!dateTime) {
        return "Job has not run yet";
      } else {
        let d = new Date(dateTime);

        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
      }
    },
  },
};
</script>
<style scoped>
div.main_div {
  text-align: left;
  margin-left: 2.5rem;
  font-size: 0.7rem;
}
button {
  font-size: 0.7rem;
  margin-top: 0.2rem;
}
.add-edit-form {
  display: flex;
  flex-direction: column;
  font-size: 0.65rem;
  margin-top: 2rem;
}
.add-edit-form input {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}
.save-button,
.cancel-button {
  width: 5rem;
  margin-left: 2rem;
  margin-top: 0.5rem;
}
table tr:not(:first-child) {
  cursor: pointer;
}
tr:first-child td {
  font-weight: bold;
}
tr.active-job {
  background-color: rgba(74, 255, 98, 0.8);
}
tr.inactive-job {
  background-color: rgba(255, 68, 68, 0.8);
  color: white;
}
td {
  border-top-style: solid;
  border-top-color: black;
  border-top-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 1px;
}
td:first-child {
  width: 10rem;
  border-left: solid 1px black;
}
td:nth-child(2) {
  width: 10rem;
}
td:nth-child(3) {
  width: 5rem;
}
td:nth-child(4) {
  width: 2rem;
  border-right: solid 1px black;
}
</style>