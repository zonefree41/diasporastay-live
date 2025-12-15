import express from "express";
import { getNextPayoutInfo } from "../controllers/ownerPayoutInfoController.js";
import { protectOwner } from "../middleware/protectOwner.js";

const router = express.Router();

router.get("/next-payout", protectOwner, getNextPayoutInfo);

export default router;
