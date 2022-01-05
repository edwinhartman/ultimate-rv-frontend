<template>
    <div class="main">
        <div v-if="tasks.length == 0">No existing tasks found</div>
        <table v-if="tasks.length > 0">
            <tr>
                <td>Name</td>
                <td>Requires</td>
                <td>Executes</td>
            </tr>
            <tr v-for="task in tasks" :key="task._id">
                <td>{{ task.name }}</td>
                <td>{{ task.requires }}</td>
                <td>{{ task.executes }}</td>
            </tr>
        </table>
        <button @click="showAddEditForm=true">Add New CRON Task</button>
        <div v-if="showAddEditForm" class="form">
            <div>Name: <input type="text" name="" id="" style="width:15rem;" v-model="taskName" required></div>
            <div>Requires: <select name="" id="" v-model="selectedHandler">
                <option v-for="(handler,idx) in handlers" :key="idx" :value="handler">{{ handler.fileName }}</option>
                </select></div>
            <div v-if="selectedHandler != null">Executes: <select name="" id="" v-model="selectedFunction">
                <option v-for="(method,idx) in selectedHandler.methods" :key="idx" :value="method">{{selectedHandler.fileName + " - " + method}}</option>
            </select>
                
            </div>
            <div><button @click="saveTask">Save</button><button @click="cancel">Cancel</button></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name:"AdminCronTasks",
    data(){
        return {
            handlers:[],
            tasks:[],
            showAddEditForm:false,
            id:null,
            taskName:"",
            selectedHandler:null,
            selectedFunction:null
        }
    },
    mounted(){
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getAllHandlers",
            method:'get'
        }).then((res)=>{
            // console.log(res)
            this.handlers = res.data.handlers
        })
        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/getCronTasks",
            method:'get'
        }).then((res)=>{
            this.tasks = res.data.tasks
        })
    },
    methods:{
        saveTask(){
            console.log("saveTask")
            axios({
                url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/saveCronTask",
                method:'post',
                data:{
                    id:this.id,
                    name:this.taskName,
                    requires:this.selectedHandler.fileName,
                    executes:this.selectedFunction
                }
            }).then((res)=>{
                // console.log(res)
                this.tasks = res.data.tasks
            })
        },
        cancel(){
            this.showAddEditForm = false
        }
    }
}
</script>
<style scoped>
* {
    font-size:0.7rem;
}
div.main{
    text-align: left;
    margin-left:2.5rem;
}
div.form{
    margin-top:0.5rem;
}
div.form input {
    margin-top:0.1rem;
    margin-bottom: 0.1rem;
}
div.form button {
    margin-left:2rem;
    margin-top:0.5rem;
}
table tr:not(:first-child){
    cursor: pointer;
}
table > tr:first-child {
    font-weight:bold;
}
table td:nth-child(1){
    width:12rem;
    border-left:solid black 1px;
}
table td:nth-child(2){
    width:8rem;
}
table td:nth-child(3){
    width:15rem;
    border-right:solid black 1px;
}
table td{
    border-top: solid black 1px;
    border-bottom:solid black 1px;
}
</style>