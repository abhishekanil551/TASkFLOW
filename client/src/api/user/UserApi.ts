import { api } from "../axios";

export const userApi = {
  checkEmail: async (email: string): Promise<{
    valid: boolean;
    name?: string;
  }> => {
    try {
      const res = await api.get("/users/check-email", {
        params: { email },
      });

      return {
        valid: res.data.exists,
        name: res.data.name,
      };
    } catch {
      return { valid: false };
    }
  },
};