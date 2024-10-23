
import { jwtDecode } from "jwt-decode";
import type { JWTPayload, JWTType } from "@definetypes/request.types";
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

export const signToken = ({ payload, options }: JWTType) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
}

export const generateHash = (payload: any) => {
  return new Promise((resolve, reject) => {
    return bcrypt.hash(payload, 10)
      .then((hash: string) => resolve(hash))
      .catch((err: {}) => reject(false))
  })
}

export const decodeTokenFromRequest = (request: any): JWTPayload => {
  return jwtDecode(String(request.headers.authorization).split(" ")[1])
}