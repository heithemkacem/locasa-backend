import { Router } from "express";
import { verifyRole, verifyToken } from "../middleware";

import { deleteAccount } from "../controllers/client-controller";

const router = Router();

router.post(
  "/delete-account",
  verifyToken,
  verifyRole("client"),
  deleteAccount
);

export default router;
