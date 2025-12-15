import express from "express";
import { getNextPayoutInfo } from "../controllers/ownerPayoutInfoController.js";
import { protectOwner } from "../middleware/protectOwner.js";

const router = express.Router();

/**
 * GET next payout date info (owner-only)
 * /api/owner/payout-info/next-payout
 */
router.get("/next-payout", protectOwner, getNextPayoutInfo);

export default router;
