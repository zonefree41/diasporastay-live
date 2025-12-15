import Stripe from "stripe";
import Owner from "../models/Owner.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Connect Express Account
 */
export const createStripeAccount = async (req, res) => {
    const owner = await Owner.findById(req.ownerId);

    if (owner.stripeAccountId) {
        return res.json({ stripeAccountId: owner.stripeAccountId });
    }

    const account = await stripe.accounts.create({
        type: "express",
        email: owner.email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
    });

    owner.stripeAccountId = account.id;
    owner.stripeOnboardingStatus = "PENDING";
    await owner.save();

    res.json({ stripeAccountId: account.id });
};

/**
 * Create Stripe onboarding link
 */
export const createOnboardingLink = async (req, res) => {
    const owner = await Owner.findById(req.ownerId);

    if (!owner.stripeAccountId) {
        return res.status(400).json({ message: "Stripe account not created" });
    }

    const link = await stripe.accountLinks.create({
        account: owner.stripeAccountId,
        refresh_url: `${process.env.FRONTEND_URL}/owner/stripe/refresh`,
        return_url: `${process.env.FRONTEND_URL}/owner/stripe/success`,
        type: "account_onboarding",
    });

    res.json({ url: link.url });
};

/**
 * Check Stripe account status
 */
export const checkStripeStatus = async (req, res) => {
    const owner = await Owner.findById(req.ownerId);

    if (!owner.stripeAccountId) {
        return res.json({ ready: false });
    }

    const account = await stripe.accounts.retrieve(owner.stripeAccountId);

    owner.chargesEnabled = account.charges_enabled;
    owner.payoutsEnabled = account.payouts_enabled;
    owner.stripeOnboardingStatus =
        account.charges_enabled && account.payouts_enabled
            ? "COMPLETED"
            : "PENDING";

    await owner.save();

    res.json({
        ready: owner.chargesEnabled && owner.payoutsEnabled,
    });
};
