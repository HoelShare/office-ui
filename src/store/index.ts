import Vue from 'vue';
import Vuex, { Commit } from 'vuex';
import authModule from '@/store/auth';
import entityApi from '@/store/entity-api';
import axios, { AxiosInstance } from 'axios';
import * as entity from '@/interfaces/Entity';
import * as types from './types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    axios: null as AxiosInstance | null,
    authToken: null as string | null,
  },
  mutations: {
    [types.AUTHENTICATE](state: any, authToken: string | null) {
      if (authToken) {
        localStorage.setItem(types.KEY_AUTH_TOKEN, authToken);
      } else {
        localStorage.removeItem(types.KEY_AUTH_TOKEN);
      }

      state.authToken = authToken;

      // eslint-disable-next-line no-param-reassign
      state.axios.defaults.headers = {
        ...state.axios.defaults.headers,
        'auth-token': authToken,
      };
    },
    [types.AUTH_AXIOS](state: any, axiosInstance: AxiosInstance) {
      state.axios = axiosInstance;
    },
  },

  actions: {
    initAxios({ commit }: { commit: Commit }, axiosInstance: AxiosInstance) {
      commit(types.AUTH_AXIOS, axiosInstance);
      const authToken = localStorage.getItem(types.KEY_AUTH_TOKEN);
      commit(types.AUTHENTICATE, authToken);
    },
  },
  modules: {
    auth: authModule,
    [entity.NAMES.asset]: entityApi<entity.Asset>(entity.NAMES.asset),
    [entity.NAMES.booking]: entityApi<entity.Booking>(entity.NAMES.booking),
    [entity.NAMES.building]: entityApi<entity.Building>(entity.NAMES.building),
    [entity.NAMES.floor]: entityApi<entity.Floor>(entity.NAMES.floor),
    [entity.NAMES.seat]: entityApi<entity.Seat>(entity.NAMES.seat),
    [entity.NAMES.seatAsset]: entityApi<entity.SeatAsset>(entity.NAMES.seatAsset),
    [entity.NAMES.user]: entityApi<entity.User>(entity.NAMES.user),
  },
});

const baseUrl = process.env.VUE_APP_API_BASE_URL ?? process.env.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

store.dispatch('initAxios', axiosInstance);

export default store;
