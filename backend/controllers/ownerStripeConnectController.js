import stripe from "../config/stripe.js";
import Owner from "../models/Owner.js";

/* ======================================================
   1️⃣ CREATE STRIPE ACCOUNT
====================================================== */
export const createStripeAccount = async (req, res) => {
    try {
        const ownerId = req.owner?._id;

        if (!ownerId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // If already created, return existing account
        if (owner.stripeAccountId) {
            return res.json({
                accountId: owner.stripeAccountId,
                alreadyExists: true,
            });
        }

        // Create Stripe Express account
        const account = await stripe.accounts.create({
            type: "express",
            email: owner.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        owner.stripeAccountId = account.id;
        await owner.save();

        res.json({
            accountId: account.id,
            created: true,
        });
    } catch (error) {
        console.error("Create Stripe account error:", error);
        res.status(500).json({ message: "Failed to create Stripe account" });
    }
};

/* ======================================================
   2️⃣ CREATE ONBOARDING LINK
====================================================== */
export const createOnboardingLink = async (req, res) => {
    try {
        const ownerId = req.owner?._id;

        if (!ownerId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner || !owner.stripeAccountId) {
            return res.status(400).json({
                message: "Stripe account not created yet",
            });
        }

        const link = await stripe.accountLinks.create({
            account: owner.stripeAccountId,
            refresh_url: "http://localhost:5173/owner/stripe/refresh",
            return_url: "http://localhost:5173/owner/dashboard",
            type: "account_onboarding",
        });

        res.json({ url: link.url });
    } catch (error) {
        console.error("Create onboarding link error:", error);
        res.status(500).json({ message: "Failed to create onboarding link" });
    }
};

/* ======================================================
   3️⃣ CHECK STRIPE STATUS
====================================================== */
export const checkStripeStatus = async (req, res) => {
    try {
        const ownerId = req.owner?._id;

        if (!ownerId) {
            return res.status(401).json({
                connected: false,
                message: "Not authenticated",
            });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner || !owner.stripeAccountId) {
            return res.json({
                connected: false,
                requiresOnboarding: true,
            });
        }

        const account = await stripe.accounts.retrieve(
            owner.stripeAccountId
        );

        const isComplete =
            account.charges_enabled && account.payouts_enabled;

        res.json({
            connected: isComplete,
            requiresOnboarding: !isComplete,
            accountId: owner.stripeAccountId,
        });
    } catch (error) {
        console.error("Stripe status check error:", error);
        res.status(500).json({
            connected: false,
            message: "Failed to check Stripe status",
        });
    }
};
