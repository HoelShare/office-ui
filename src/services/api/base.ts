import axios, { AxiosInstance } from 'axios';

export default abstract class Api {
  protected baseUrl: string;

  protected axios: AxiosInstance;

  constructor() {
    this.baseUrl = process.env.VUE_APP_API_BASE_URL ?? process.env.API_BASE_URL;

    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
