import express from "express";
import { ownerAuth } from "../middleware/ownerAuth.js";
import { getOwnerAnalytics } from "../controllers/ownerAnalyticsController.js";

const router = express.Router();

router.get("/summary", ownerAuth, getOwnerAnalytics);

export default router;
