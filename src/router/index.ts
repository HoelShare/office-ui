import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: {
      isLogin: true,
    },
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import(/* webpackChunkName: "bookings" */ '@/views/BookingList.vue'),
  },
  {
    path: '/admin/building',
    name: 'AdminBuilding',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Building.vue'),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/floor',
    name: 'AdminFloor',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Floor.vue'),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/seat',
    name: 'AdminSeat',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Seat.vue'),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Logout.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = store.getters;
  if (!to.meta.isLogin && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.isLogin && isAuthenticated) {
    next({ name: 'Home' });
  } else if (to.meta.requireAdmin && !isAdmin) {
    next(false);
  } else {
    next();
  }
});

export default router;
