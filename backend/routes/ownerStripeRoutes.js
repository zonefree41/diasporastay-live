// backend/routes/ownerStripeRoutes.js
import express from "express";
import { ownerAuth } from "../middleware/ownerAuth.js";
import Owner from "../models/Owner.js";
import stripe from "../config/stripe.js";


const router = express.Router();

/**
 * POST /api/owner/stripe/connect-link
 * Create or reuse a Stripe Standard account and return onboarding link
 */
router.post("/connect-link", ownerAuth, async (req, res) => {
    try {
        const owner = await Owner.findById(req.owner._id);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        // 1️⃣ Create Stripe account if missing
        if (!owner.stripeAccountId) {
            const account = await stripe.accounts.create({
                type: "standard",
                email: owner.email,
            });

            owner.stripeAccountId = account.id;
            await owner.save();
        }

        // 2️⃣ Create onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: owner.stripeAccountId,
            refresh_url: "http://localhost:5173/owner/payouts?refresh=1",
            return_url: "http://localhost:5173/owner/payouts?onboarding=success",
            type: "account_onboarding",
        });

        return res.json({ url: accountLink.url });
    } catch (err) {
        console.error("Owner Stripe connect-link error:", err);
        return res.status(500).json({ error: "Failed to create connect link" });
    }
});

/**
 * GET /api/owner/stripe/account
 * Check Stripe account status (charges_enabled, payouts_enabled, etc.)
 */
router.get("/account", ownerAuth, async (req, res) => {
    try {
        const owner = await Owner.findById(req.owner._id);
        if (!owner || !owner.stripeAccountId) {
            return res.json({
                connected: false,
                charges_enabled: false,
                payouts_enabled: false,
            });
        }

        const account = await stripe.accounts.retrieve(owner.stripeAccountId);

        return res.json({
            connected: true,
            stripeAccountId: owner.stripeAccountId,
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
        });
    } catch (err) {
        console.error("Owner Stripe account status error:", err);
        return res.status(500).json({ error: "Failed to load Stripe account info" });
    }
});

export default router;
