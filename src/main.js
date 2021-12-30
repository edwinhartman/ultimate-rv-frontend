process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index';
import axios from 'axios'
import './index.css'
import  VueHtmlToPaper from './components/other/VueHtmlToPaper'

axios.interceptors.request.use((config) => {
    console.log(process.env.VUE_APP_BACKEND_CONNECTION_URI)
    let split_url = config.url.split('/')
    if (split_url[0] + "//" + split_url[2] == process.env.VUE_APP_BACKEND_CONNECTION_URI){
    // Do something before request is sent
        let token = localStorage.getItem('user-token');
        if (token) {
            config.headers['Authorization'] = token; //`Bearer ${ token }`;
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

const app = createApp(App)

app.config.globalProperties.$axios = axios

app.use(store).use(router).use(VueHtmlToPaper).mount('#app')
