import express from "express";
import profileRouter from "./profile_routes";
import clientRouter from "./client_routes";
import vendorRouter from "./vendor_routes";
const router = express.Router();

router.use("/", profileRouter);
router.use("/", clientRouter);
router.use("/", vendorRouter);

export default router;
