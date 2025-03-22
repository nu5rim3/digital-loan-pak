import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { handleAxiosError } from "../utils/APIErrorNotification";
import { jwtDecode } from "jwt-decode";

const getToken = () => localStorage.getItem("token");

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

const APIAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

const APIFileInstance = axios.create({
  responseType: "arraybuffer" as "json",
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ **Interceptor to always use the latest token**
const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const decodedToken = jwtDecode(token);
      if (
        config.method?.toUpperCase() === "POST" ||
        config.method?.toUpperCase() === "PUT"
      ) {
        config.headers["X-Auth-Token"] = btoa(decodedToken?.sub || "");
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  return config;
};

// ✅ **Non Interceptor to always use the latest token**
const nonAuthInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// ✅ **Attach interceptors to always use the latest token**
API.interceptors.request.use(nonAuthInterceptor, (error) =>
  Promise.reject(error)
);
APIAuth.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);
APIFileInstance.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

// ✅ **Response Interceptors**
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseInterceptor = (response: any) => response;
const errorInterceptor = (error: AxiosError) => {
  handleAxiosError(error);
  return Promise.reject(error);
};

API.interceptors.response.use(responseInterceptor, errorInterceptor);
APIAuth.interceptors.response.use(responseInterceptor, errorInterceptor);
APIFileInstance.interceptors.response.use(
  responseInterceptor,
  errorInterceptor
);

export { API, APIAuth, APIFileInstance };
