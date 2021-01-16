import Vue from 'vue';
import Vuex from 'vuex';
import authModule from '@/store/auth';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },

  actions: {

  },
  modules: {
    auth: authModule,
  },
});

const baseUrl = process.env.VUE_APP_API_BASE_URL ?? process.env.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

store.dispatch('setAxios', axiosInstance);

export default store;
