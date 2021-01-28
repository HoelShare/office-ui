import { LoginForm, LoginResponse } from '@/interfaces/Login';
import { User } from '@/interfaces/Entity';
import { Commit, Dispatch } from 'vuex';
import { RootState } from '@/interfaces/States';
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
    async login({ rootState, dispatch }: { rootState: RootState; dispatch: Dispatch },
      { username, password }: LoginForm): Promise<LoginResponse> {
      if (!username || !password) {
        return { success: false, error: 'Kein Username / password' };
      }

      try {
        return await rootState.axios!.post('/api/login', { username, password })
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
    async doSamlLogin({ rootState, dispatch }:
      { dispatch: Dispatch; rootState: RootState }): Promise<LoginResponse> {
      try {
        return await rootState.axios!.get('/api/login', {
          withCredentials: true,
        })
          .then((response: any) => {
            const { user, message, authToken } = response.data;

            if (!authToken) {
              return { success: false, error: message };
            }
            return dispatch('authUser', { authToken, user }, { root: true })
              .then(() => ({ success: true, error: null }));
          });
      } catch (e) {
        window.location.href = `${rootState.axios!.defaults.baseURL}/api/login?return_url=${window.location.origin}`;
      }
      return { success: false, error: 'Authorization not completed!\nRedirect to Authentication Provider' };
    },
    async authUser({ commit }: { commit: Commit },
      { authToken, user }: { authToken: string; user: User }) {
      commit(types.AUTH_USER, user, { root: true });
      commit(types.AUTHENTICATE, authToken, { root: true });
    },
    async logout({ rootState, commit }: { rootState: RootState; commit: Commit }) {
      if (rootState.authToken !== null) {
        rootState.axios!.post('/api/logout');
      }

      commit(types.AUTH_USER, null, { root: true });
      commit(types.AUTHENTICATE, null, { root: true });
    },
    async fetchMe({ rootState, commit }: { commit: Commit; rootState: RootState }) {
      try {
        const { data } = await rootState.axios!.get('/api/user/me');
        commit(types.AUTH_USER, data.user, { root: true });
      } catch (e) {
        // nth
      }
    },
  },
};
