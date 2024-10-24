"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]);
    if (token == null)
        return res.status(401).json({ message: "You are not authorized to access this endpoint." });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err)
            return res.status(401).json({ message: "Unathorized user." });
        next();
    });
};
exports.validateToken = validateToken;
