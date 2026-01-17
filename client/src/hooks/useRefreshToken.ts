import useUser from '@/store/user';
import axios from 'axios';

const useRefreshToken = () => {
  const { loginUser } = useUser();
  const refreshToken = async () => {
    try {
      const response = await axios.get('/auth/refresh-token', {
        withCredentials: true,
      });

      if (response?.data?.user) {
        loginUser(response.data.user);
      }

      return response.data.user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
  };
  return refreshToken;
};

export default useRefreshToken;
