import { Router } from "express";
import { validateToken } from "@routes/middleware";
import {
  getDentistAvailability,
  retrieveDentist,
  retrieveProfile,
  updateProfile
} from "@controllers/user.controller";

const router = Router();

router.get("/dentist", retrieveDentist)
router.get("/dentist-availability", getDentistAvailability)
router.get("/profile", validateToken, retrieveProfile)
router.put("/profile", validateToken, updateProfile)

export default router;