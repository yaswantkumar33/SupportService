import { UserRole } from "../db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userRole: UserRole;
      };
    }
  }
}
