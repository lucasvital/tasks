// authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface DecodedToken {
  id: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Não autorizado, token ausente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as DecodedToken;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Não autorizado, usuário inválido" });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    }; // Atribuição ao tipo definido no d.ts

    next();
  } catch (err) {
    return res.status(401).json({ error: "Não autorizado, token inválido" });
  }
};
