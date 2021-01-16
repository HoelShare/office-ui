import { LoginForm, LoginResponse } from '@/interfaces/Login';
import { User } from '@/interfaces/User';
import { AxiosInstance } from 'axios';
import { Dispatch } from 'vuex';

const KEY_AUTH_TOKEN = 'auth-token';

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
  actions: {
    setAxios({ state, dispatch }: { state: any; dispatch: Dispatch }, axios: AxiosInstance) {
      console.log('set axios');
      state.axios = axios;

      const authToken = localStorage.getItem(KEY_AUTH_TOKEN);
      if (authToken) {
        state.authToken = authToken;

        // eslint-disable-next-line no-param-reassign
        axios.defaults.headers = {
          ...axios.defaults.headers,
          'auth-token': localStorage.getItem(KEY_AUTH_TOKEN),
        };

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
    async authUser({ state }: any, { authToken, user }: { authToken: string; user: User }) {
      state.user = user;
      state.authToken = authToken;

      localStorage.setItem(KEY_AUTH_TOKEN, authToken);
    },
    async logout({ state }: any) {
      state.authToken = null;
      localStorage.removeItem(KEY_AUTH_TOKEN);
    },
    async fetchMe({ state }: { state: { user: User | null; axios: AxiosInstance } }) {
      try {
        const { data } = await state.axios.get('/api/user/me');
        state.user = data.user;
      } catch (e) {
        // nth
      }
    },
  },
};

export default authModule;
