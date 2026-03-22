import type { AuthRepository  } from "../../domain/repositories/AuthRepository";

export const registerUser = async (
    repo: AuthRepository,
    data: { name: string; email: string; password: string}
) => {
    return repo.register(data);
};

