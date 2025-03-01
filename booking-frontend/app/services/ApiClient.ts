// services/ApiClient.ts
import axios, { AxiosInstance } from "axios";
import Swal from "sweetalert2";

class ApiClient {
  
  private axiosInstance: AxiosInstance;
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken"); // Fetch token from localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await new Promise((resolve) => {
            Swal.fire({
              title: "Session Expired",
              text: "You will be logged out.",
              icon: "warning",
              confirmButtonText: "OK",
            }).then(() => {
              resolve(true); 
            });
          });
    
          localStorage.removeItem("authToken");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default ApiClient;
