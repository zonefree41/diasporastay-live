import express from "express";
import { getOwnerPayoutHistory } from "../controllers/ownerPayoutHistoryController.js";
import protectOwner from "../middleware/protectOwner.js";

const router = express.Router();

router.get("/history", protectOwner, getOwnerPayoutHistory);

export default router;
