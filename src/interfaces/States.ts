import { AxiosInstance } from 'axios';

export interface RootState {
  axios: AxiosInstance | null;
  authToken: string | null;
}
