import { useCallback } from "react";
import { userApi } from "../api/user/UserApi";

export const useUser = () => {
  const checkUser = useCallback(async (email: string) => {
    console.log("checking email:", email);
    return userApi.checkEmail(email);
  }, []);

  return { checkUser };
};