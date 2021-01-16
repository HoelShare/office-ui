import { LoginForm, LoginResponse } from '@/interfaces/Login';
import { User } from '@/interfaces/User';
import { AxiosInstance } from 'axios';
import { Commit, Dispatch } from 'vuex';

const KEY_AUTH_TOKEN = 'auth-token';
const AUTHENTICATE = 'authenticate';
const AUTH_AXIOS = 'auth_axios';
const AUTH_USER = 'auth_user';

const authModule = {
  state: () => ({
    axios: null as AxiosInstance | null,
    user: null as User | null,
    authToken: null as string | null,
  }),
  getters: {
    isAdmin({ user }: { user: User | null }): boolean {
      return user !== null && user.isAdmin;
    },
    isAuthenticated({ authToken }: { authToken: string | null }): boolean {
      return authToken !== null;
    },
    getAuthToken({ authToken }: { authToken: string | null }): string | null {
      return authToken;
    },
  },
  mutations: {
    [AUTHENTICATE](state: any, authToken: string | null) {
      if (authToken) {
        localStorage.setItem(KEY_AUTH_TOKEN, authToken);
      } else {
        localStorage.removeItem(KEY_AUTH_TOKEN);
      }

      state.authToken = authToken;

      // eslint-disable-next-line no-param-reassign
      state.axios.defaults.headers = {
        ...state.axios.defaults.headers,
        'auth-token': authToken,
      };
    },
    [AUTH_AXIOS](state: any, axios: AxiosInstance) {
      state.axios = axios;
    },
    [AUTH_USER](state: any, user: User | null) {
      state.user = user;
    },
  },
  actions: {
    initAxios({ dispatch, commit }: { dispatch: Dispatch; commit: Commit }, axios: AxiosInstance) {
      commit(AUTH_AXIOS, axios);

      const authToken = localStorage.getItem(KEY_AUTH_TOKEN);
      if (authToken) {
        commit(AUTHENTICATE, authToken);

        dispatch('fetchMe');
      }
    },
    async login({ state, dispatch }: { state: any; dispatch: Dispatch },
      { username, password }: LoginForm): Promise<LoginResponse> {
      if (!username || !password) {
        return { success: false, error: 'Kein Username / password' };
      }

      try {
        console.log('Auth user');

        return await state.axios.post('/api/login', { username, password })
          .then((response: any) => {
            const { user, message, authToken } = response.data;
            console.log('Has Response');

            if (!authToken) {
              return { success: false, error: message };
            }
            return dispatch('authUser', { authToken, user })
              .then(() => ({ success: true, error: null }));
          });
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    async authUser({ commit }: { commit: Commit },
      { authToken, user }: { authToken: string; user: User }) {
      commit(AUTH_USER, user);
      commit(AUTHENTICATE, authToken);
    },
    async logout({ state, commit }: { state: any; commit: Commit }) {
      if (state.authToken !== null) {
        state.axios.post('/api/logout');
      }

      commit(AUTH_USER, null);
      commit(AUTHENTICATE, null);
    },
    async fetchMe({ state, commit }: { commit: Commit; state: { axios: AxiosInstance } }) {
      try {
        const { data } = await state.axios.get('/api/user/me');
        commit(AUTH_USER, data.user);
      } catch (e) {
        // nth
      }
    },
  },
};

export default authModule;
