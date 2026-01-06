import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export const sendGoogleAuthCode = (code: string) =>
  api
    .get(`/auth/google?code=${code}`)
    .then((res) => res.data);
