import { Base_URL } from "@/const/const";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

const axiosInstance = axios.create({
  baseURL: Base_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const useApi = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (isSignedIn && isLoaded && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken, isSignedIn, isLoaded]);
  return axiosInstance;
};
