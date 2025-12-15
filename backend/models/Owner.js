import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ownerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        // 🔑 Stripe Connect fields
        stripeAccountId: { type: String },
        stripeOnboardingStatus: {
            type: String,
            enum: ["NOT_STARTED", "PENDING", "COMPLETED"],
            default: "NOT_STARTED",
        },
        chargesEnabled: { type: Boolean, default: false },
        payoutsEnabled: { type: Boolean, default: false },

        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

// Hash password
ownerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

ownerSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Owner", ownerSchema);
