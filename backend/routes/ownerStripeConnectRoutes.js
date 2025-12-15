console.log("🔥 ownerStripeConnectRoutes loaded");

import express from "express";
import {
    createStripeAccount,
    createOnboardingLink,
    checkStripeStatus,
} from "../controllers/ownerStripeConnectController.js";
import { protectOwner } from "../middleware/protectOwner.js";

const router = express.Router();

// ✅ Create Stripe account
router.post(
    "/create-account",
    protectOwner,
    (req, res, next) => {
        console.log("🔥 create-account route HIT");
        next();
    },
    createStripeAccount
);

// ✅ Create onboarding link
router.post(
    "/onboarding-link",
    protectOwner,
    createOnboardingLink
);

// ✅ Check Stripe status
router.get(
    "/status",
    protectOwner,
    checkStripeStatus
);

export default router;
