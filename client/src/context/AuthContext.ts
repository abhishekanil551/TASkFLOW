import { createContext } from "react";

export type User = {
  id: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);