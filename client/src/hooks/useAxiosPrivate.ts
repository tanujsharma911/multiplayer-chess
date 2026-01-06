import useUser from "@/store/user";
import { api } from "../api/api";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useApiPrivate = () => {
  const { user } = useUser();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Don't set Content-Type for FormData, let browser handle it
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          // Unauthorized on first try, try refreshing token
          console.log(
            "👉 First response :: unauthorized error -> trying to refresh token"
          );

          prevRequest.sent = true;

          const newUserData = await refreshToken();

          if (newUserData) {
            console.log(
              "👉 Second response :: Token refreshed -> retrying original request"
            );
            // Retry original request with new token
            return api(prevRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [user, refreshToken]);

  return api;
};

export default useApiPrivate;
