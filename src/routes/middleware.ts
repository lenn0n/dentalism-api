require("dotenv").config()

import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken")

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  if (token == null) return res.status(401).json({ message: "You are not authorized to access this endpoint." });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any) => {
    if (err) return res.status(401).json({ message: "Unathorized user."});
    next()
  })
}
