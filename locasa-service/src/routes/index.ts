import express from "express";
import profileRouter from "./profile_routes";
import clientRouter from "./client_routes";
const router = express.Router();

router.use("/", profileRouter);
router.use("/", clientRouter);

export default router;
