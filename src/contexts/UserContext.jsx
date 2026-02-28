import { createContext, useContext, useEffect, useState } from "react";
import { getUserAPI, getAdminAPI } from "../services/allAPIs";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      if (role === "admin") {
        const res = await getAdminAPI(headers);
        if (res.status === 200) setUser({ ...res.data, role: "admin" });
      } else {
        const res = await getUserAPI(headers);
        if (res.status === 200) setUser({ ...res.data, role });
      }
    } catch (error) {
      console.error("User fetch failed:", error);
      sessionStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Sync across tabs
  useEffect(() => {
    const syncAuth = () => fetchUser();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return <UserContext.Provider value={{ user, loading, fetchUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
