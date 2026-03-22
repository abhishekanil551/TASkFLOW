import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export const userLogin = async (
    repo: AuthRepository,
    data: {email: string, password: string}
) => {
    return repo.login(data)
}