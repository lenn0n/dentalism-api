import { Router } from "express";
import {
  loginWithEmail,
  generateToken
} from "@controllers/auth.controller";

const router = Router();

router.post("/login", loginWithEmail)
router.post("/generate-token", generateToken)

export default router;