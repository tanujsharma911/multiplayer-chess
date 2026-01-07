
import { create } from "zustand";

interface User {
  isLoggedIn?: boolean;
  name: string | null;
  email: string | null;
  avatar?: string | null;
}

const useUser = create<{
  user: User;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}>((set) => ({
  user: {
    isLoggedIn: false,
    name: null,
    email: null,
    avatar: null,
  },
  loginUser: (user: User) => set({ user: { ...user, isLoggedIn: true } }),
  logoutUser: () =>
    set({
      user: {
        isLoggedIn: false,
        name: null,
        email: null,
        avatar: null,
      },
    }),
}));

export default useUser;
