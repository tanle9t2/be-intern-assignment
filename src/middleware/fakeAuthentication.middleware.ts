// src/middleware/validateUser.ts
import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization;

  if (!userId) {
    return res.status(401).json({ message: 'Missing Authorization header (user id)' });
  }

  req.user = { id: Number(userId) }; // Pretend we decoded the user ID
  next();
};
