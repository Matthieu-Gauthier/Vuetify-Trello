import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';

import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';
import Boards from './views/Boards.vue';
import Board from './views/Board.vue';

Vue.use(Router);

function isLoggedIn(to, from, next) {
  store.dispatch('auth/authenticate').then(() => {
    next();
  }).catch(() => {
    next('/login');
  });
}
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: '/',
      component: Boards,
      beforeEnter: isLoggedIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards,
      beforeEnter: isLoggedIn
    },
    {
      path: '/boards/:id',
      name: 'board',
      component: Board,
      beforeEnter: isLoggedIn
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
