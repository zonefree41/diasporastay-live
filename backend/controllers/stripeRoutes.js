import express from "express";
import { createCheckoutSession } from "../controllers/stripeController.js";
import { protectGuest } from "../middleware/protectGuest.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  protectGuest, // ✅ middleware belongs HERE
  createCheckoutSession
);

export default router;
