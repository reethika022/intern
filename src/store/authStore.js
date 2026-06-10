import { create } from "zustand";

const defaultUser = {
  id: "user-001",
  email: "user@biofactor.com",
  name: "Uma Reethika",
  role: "Admin",
};

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const isLoggedOut = () => localStorage.getItem("loggedOut") === "true";

const initialUser = isLoggedOut() ? null : getStoredUser() || defaultUser;

export const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  
  login: (email, password, name) => {
    if (email && password) {
      const userData = {
        id: "user-001",
        email,
        name: name || email.split("@")[0],
        role: "Admin",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("loggedOut");
      set({ user: userData, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem("user");
    localStorage.setItem("loggedOut", "true");
    set({ user: null, isAuthenticated: false });
  },
}));
