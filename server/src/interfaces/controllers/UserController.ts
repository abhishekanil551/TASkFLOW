import { Request, Response } from "express";
import { CheckUserEmail } from "../../application/usecases/users/CheckUserEmail";

export class UserController {
  constructor(private checkUserEmail: CheckUserEmail) {}

  async checkEmail(req: Request, res: Response) {
    try {
      const email = req.query.email;

      if (typeof email !== "string") {
        return res.status(400).json({ message: "Email required" });
      }

      const result = await this.checkUserEmail.execute(email);

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ message: "Failed to check email" });
    }
  }
}