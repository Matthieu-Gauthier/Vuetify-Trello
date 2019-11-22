import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';

import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Boards from './views/Boards.vue';

Vue.use(Router);



export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        store.dispatch('auth/authenticate').then(() => {
          next('/home');
        }).catch(() => {
          next('/login');
        });
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () { 
        return import(/* webpackChunkName: "about" */ './views/About.vue')
      }
    }
  ]
})
