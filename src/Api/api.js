import axios from "axios";

class Api {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `http://localhost:11434/api`,
    });

    this.axiosInstance.interceptors.request.use(
      function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        // Do something before request is sent
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    this.axiosInstance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        // Pass error to React Query or any promise-based handler
        return Promise.reject(error);
      }
    );
  }
}
export default new Api();
