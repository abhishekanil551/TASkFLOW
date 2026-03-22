import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../components/hooks/useAuth";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getMe, logout: apiLogout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [getMe]);

  const logout = async () => {
    await apiLogout();   
    setUser(null);      
    window.location.href = "/"; 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuth: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};