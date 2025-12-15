import express from "express";
import {
    getPendingPayouts,
    markPayoutAsPaid,
} from "../controllers/adminPayoutController.js";
import { protectAdmin } from "../middleware/protectAdmin.js";

const router = express.Router();

/**
 * GET all pending payouts
 */
router.get("/pending", protectAdmin, getPendingPayouts);

/**
 * POST mark payout as paid
 */
router.post("/mark-paid", protectAdmin, markPayoutAsPaid);

export default router;
