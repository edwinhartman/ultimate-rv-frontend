process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index';
import axios from 'axios'
import './index.css'
import  VueHtmlToPaper from './components/other/VueHtmlToPaper'
import LoadScript from 'vue-plugin-load-script';

import AllStates from './definitions/AllStates'
import ErrorCodes from './definitions/ErrorCodes'

axios.interceptors.request.use((config) => {
    // console.log(process.env.VUE_APP_BACKEND_CONNECTION_URI)
    let split_url = config.url.split('/')
    if (split_url[0] + "//" + split_url[2] == process.env.VUE_APP_BACKEND_CONNECTION_URI){
        // const https = require('https')
        // config.httpsAgent = new https.Agent({rejectUnauthorized:false})
    // Do something before request is sent
        let token = localStorage.getItem('user-token');
        if (token) {
            config.headers['Authorization'] = token; //`Bearer ${ token }`;
        }
        let adminToken = localStorage.getItem('user-token-admin');
        if (adminToken) {
            config.headers['X-Admin-Authorization'] = adminToken;
        }
    }
    //config.baseURL = process.env.VUE_APP_BACKEND_CONNECTION_URI;
    //    config.headers['Access-Control-Allow-Origin'] = process.env.VUE_APP_BACKEND_CONNECTION_URI;
    //    config.crossdomain = true;
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // Any status code within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response.status)
    return response;
}, function (error) {
    if (error.response.status === 401){
        store.dispatch("logoutUser")
    }
    if (error.response.status === 987){
        // console.log(error.response)
        router.push({path:"/checkAccount/" + error.response.status})
    }
    // Any status codes outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

const app = createApp(App)

app.config.globalProperties.allStates = AllStates.AllStates
app.config.globalProperties.BackendErrorCodes = ErrorCodes.ErrorCodes
app.config.globalProperties.formatAmount = (amnt)=>{
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      
      return formatter.format(amnt);
}
app.config.globalProperties.getDateTimeFormatted = (dateTime,msg) => {
    if (!dateTime) {
        if (msg && msg != ""){
            return msg;
        }else{
            return "No date set"
        }
    } else {
      let d = new Date(dateTime);

      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }
  }
app.config.globalProperties.$axios = axios

app.use(store).use(router).use(VueHtmlToPaper).use(LoadScript).mount('#app')
