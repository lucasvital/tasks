// src/types/express.d.ts

import { AuthenticatedUser } from "../middleware/authMiddleware"; // Ajuste o caminho conforme necessário

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser; // Atualize para o tipo que você usa no middleware
    }
  }
}
