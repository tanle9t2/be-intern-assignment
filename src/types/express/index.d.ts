// src/types/express/index.d.ts
import { User } from '../../entities/User'; // adjust the path to your User entity

declare global {
  namespace Express {
    interface Request {
      user: { id: number }; // if you just need the user id
    }
  }
}
