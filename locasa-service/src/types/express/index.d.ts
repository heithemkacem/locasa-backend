import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        type: "client" | "vendor";
        name: string;
        user_id: string;
      };
    }
  }
}
