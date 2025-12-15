// backend/routes/ownerEarningsRoutes.js

import express from "express";
import ownerEarningsController from "../controllers/ownerEarningsController.js";
import { protectOwner } from "../middleware/protectOwner.js";

const router = express.Router();

router.get(
    "/monthly",
    protectOwner,
    ownerEarningsController.getMonthlyEarnings
);

router.get(
    "/payout-summary",
    protectOwner,
    ownerEarningsController.getPayoutSummary
);

export default router;
