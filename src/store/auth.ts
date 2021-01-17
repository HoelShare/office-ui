import { LoginForm, LoginResponse } from '@/interfaces/Login';
import { User } from '@/interfaces/Entity';
import { AxiosInstance } from 'axios';
import { Commit, Dispatch } from 'vuex';
import * as types from './types';

export default {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAdmin({ user }: { user: User | null }): boolean {
      return user !== null && user.isAdmin;
    },
    isAuthenticated(_1: any, _2: any, { authToken }: { authToken: string | null }): boolean {
      return authToken !== null;
    },
    getAuthToken({ authToken }: { authToken: string | null }): string | null {
      return authToken;
    },
  },
  mutations: {
    [types.AUTH_USER](state: any, user: User | null) {
      state.user = user;
    },
  },
  actions: {
    initAxios({ dispatch }: { dispatch: Dispatch }, axios: AxiosInstance) {
      dispatch('fetchMe');
    },
    async login({ rootState, dispatch }: { rootState: any; dispatch: Dispatch },
      { username, password }: LoginForm): Promise<LoginResponse> {
      if (!username || !password) {
        return { success: false, error: 'Kein Username / password' };
      }

      try {
        return await rootState.axios.post('/api/login', { username, password })
          .then((response: any) => {
            const { user, message, authToken } = response.data;

            if (!authToken) {
              return { success: false, error: message };
            }
            return dispatch('authUser', { authToken, user }, { root: true })
              .then(() => ({ success: true, error: null }));
          });
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    async authUser({ commit }: { commit: Commit },
      { authToken, user }: { authToken: string; user: User }) {
      commit(types.AUTH_USER, user, { root: true });
      commit(types.AUTHENTICATE, authToken, { root: true });
    },
    async logout({ rootState, commit }: { rootState: any; commit: Commit }) {
      if (rootState.authToken !== null) {
        rootState.axios.post('/api/logout');
      }

      commit(types.AUTH_USER, null, { root: true });
      commit(types.AUTHENTICATE, null, { root: true });
    },
    async fetchMe({ rootState, commit }: { commit: Commit; rootState: { axios: AxiosInstance } }) {
      try {
        const { data } = await rootState.axios.get('/api/user/me');
        commit(types.AUTH_USER, data.user, { root: true });
      } catch (e) {
        // nth
      }
    },
  },
};
