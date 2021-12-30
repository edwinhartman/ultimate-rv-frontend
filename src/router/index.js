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

const routes = [
    {
        path:'/',
        name:'Home',
        meta:{
            title:'Home'
        },
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/MainView.vue'),
        beforeEnter: ifAuthenticated
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: 'Login'
        },
        component: () =>
            import ( /* webpackChunkName: "admin" */ '../views/Login.vue'),
        beforeEnter: ifNotAuthenticated
    },
    {
        path:'/register',
        name:'Register',
        meta:{
            title:'Register'
        },
        component:()=>
            import( /* webpackChunkName: "admin" */ '../views/NewAccount.vue')
    }
]
const router = new createRouter({
    history:createWebHistory(),
    routes
});
export default router