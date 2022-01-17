import {createRouter,createWebHistory} from 'vue-router'
import store from '../store';

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return;
    }
    next("/");
};
const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return;
    }
    //next("/login");

    if (to.name === "Logout" && (from.name === "Login" || from.name === null)) {
        next("/");
    } else {
        router.replace({
            path: "/login",
            query: { next_step: to.path }
        }).catch(() => {});
    }
};
const ifAuthenticatedAdmin = (to, from, next) => {
    if (store.getters.isAuthenticatedAdmin) {
        next();
        return;
    }
    //next("/login");

    if (to.name === "Logout" && (from.name === "Login" || from.name === null)) {
        next("/");
    } else {
        router.replace({
            path: "/login",
            query: { next_step: to.path }
        }).catch(() => {});
    }
};
const routes = [
    {
        path:'/',
        name:'Home',
        meta:{
            title:'Ultimate-RV : Home',
            metaTags:[{
            name:"ultimate-rv-app",
            content:"app-id=" + process.env.VUE_APP_AppleAppId + ", app-argument=" + window.location.origin +"/"
        }]},
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/MainView.vue'),
        beforeEnter: ifAuthenticated
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: 'Ultimate-RV : Login',
            metaTags:[
        {
            name:"ultimate-rv-app",
            content:"app-id=" + process.env.AppleAppID + ", app-argument=" + window.location.origin +"/login"
        }]},
        component: () =>
            import ( /* webpackChunkName: "admin" */ '../views/Login.vue'),
        beforeEnter: ifNotAuthenticated
    },
    {
        path:'/register',
        name:'Register',
        meta:{
            title:'Ultimate-RV : Register',
            metaTags:[
        {
            name:"ultimate-rv-app",
            content:"app-id=" + process.env.AppleAppID + ", app-argument=" + window.location.origin +"/register"
        }]},
        component:()=>
            import( /* webpackChunkName: "admin" */ '../views/NewAccount.vue')
    },
    {
        path:'/continueRegistration/:reg_id',
        name:'Account Setup',
        meta:{
            title:"Ultimate-RV : Account Setup",
            metaTags:[
        {
            name:"ultimate-rv-app",
            content:"app-id=" + process.env.AppleAppID + ", app-argument=" + window.location.origin +"/continueRegistration"
        }]},
        component:()=>
        import( /* webpackChunkName: "admin" */ '../views/NewAccountSetup.vue')
    },
    {
        path: '/admin',
        name: 'Admin',
        meta: {
            title: 'Ultimate-RV Admin',
            metaTags:[]
        },
        component: () =>
            import ( /* webpackChunkName: "admin" */ '../admin/views/AdminMain.vue'),
        beforeEnter: ifAuthenticatedAdmin
    },
    {
        path: '/checkAccount/:error_code',
        name:'CheckAccount',
        meta:{
            title:'Ultimate-RV : Check Account',
            metaTags:[{
            name:"ultimate-rv-app",
            content:"app-id=" + process.env.AppleAppID + ", app-argument=" + window.location.origin +"/checkAccount"
        }]},
        component: () =>
            import ( /* webpackChunkName: "admin" */ '../views/CheckAccountMain.vue'),
        beforeEnter: ifAuthenticated
    }
]
const router = new createRouter({
    history:createWebHistory(),
    routes
});

router.beforeEach((to,from,next)=>{
    const nearestWithTitle = to.matched.slice().reverse().find(r=>r.meta && r.meta.title)
    const nearestWithMeta = to.matched.slice().reverse().find(r=>r.meta && r.meta.metaTags)
    if (nearestWithTitle){
        document.title = nearestWithTitle.meta.title
    }
    nearestWithMeta.meta.metaTags.map(tagDef =>{
        const tag = document.createElement("meta")
        Object.keys(tagDef).forEach(key =>{
            tag.setAttribute(key,tagDef[key])
        })
        return tag
    }).forEach(tag => document.head.appendChild(tag))
    next()
})
export default router