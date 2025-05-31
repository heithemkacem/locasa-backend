// src/types/custom.d.ts
import { Request } from "express";

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: "client" | "vendor";
    name: string;
    user_id: string;
  };
}
