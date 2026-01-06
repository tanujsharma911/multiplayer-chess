import useUser from "@/store/user";
import { api } from "../api/api";

const useRefreshToken = () => {
  const { loginUser } = useUser();
  const refreshToken = async () => {
    try {
      const response = await api
        .get("/auth/refresh-token", {
          withCredentials: true,
        })
        .then((res) => res.data);

      console.log("Refresh Token Response:", response);

      loginUser(response.user);

      return response.user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      console.log("👉 Failed to refresh token -> because of first visit");
    }
  };
  return refreshToken;
};

export default useRefreshToken;
