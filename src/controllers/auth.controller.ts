import { Request, Response } from "express";
import { generateTokenService, loginWithEmailService } from "@services/auth.service";

const loginWithEmail = async (req: Request, res: Response) => {
  // Check if email payload is provided
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Please provide email address." });
  }

  const results = await loginWithEmailService(email)
  return res.status(results.code).json({ ...results.json, trace: 'loginWithEmail'});
}

const generateToken = async (req: Request, res: Response) => {
  // Check if hash is in the payload
  const { hash } = req.body;
  if (!hash) {
    return res.status(400).json({ message: "Please provide login hash." });
  }

  const results = await generateTokenService(hash)
  return res.status(results.code).json(results.json);
}

export {
  loginWithEmail,
  generateToken
}