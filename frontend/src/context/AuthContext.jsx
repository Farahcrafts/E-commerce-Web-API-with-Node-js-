import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const res = await axios.get(`${API}/users/${payload.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
// eslint-disable-next-line react-hooks/immutability
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
    } else {
      // Defer state update or handle via initialization
      setTimeout(() => setLoading(false), 0);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/users/login`, { email, password });
    const { token: newToken } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    return res.data;
  };

  const register = async (data) => {
    return axios.post(`${API}/users/register`, data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.isAdmin === true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
