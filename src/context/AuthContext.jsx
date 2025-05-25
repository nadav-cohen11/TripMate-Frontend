import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
  });

  const checkAuth = async () => {
    try {
      const res = await api.get("users/auth/check");
      setAuth({
        loading: false,
        isAuthenticated: true,
        user: res.data.userId,
      });
    } catch {
      setAuth({ loading: false, isAuthenticated: false, user: null });
    }
  };

  const logout = async () => {
    await api.post("users/auth/logout");
    setAuth({ loading: false, isAuthenticated: false, user: null });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
