import express from "express";
import { updateOwnerProfile, getOwnerProfile } from "../controllers/ownerProfileController.js";
import { ownerAuth } from "../middleware/ownerAuth.js";

const router = express.Router();

router.get("/me", ownerAuth, getOwnerProfile);
router.put("/update", ownerAuth, updateOwnerProfile);

export default router;
