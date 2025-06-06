import express from "express";
import profileRouter from "./profile_routes";
import clientRouter from "./client_routes";
import vendorRouter from "./vendor_routes";
const router = express.Router();

router.use("/profile", profileRouter);
router.use("/client", clientRouter);
router.use("/vendor", vendorRouter);

export default router;
