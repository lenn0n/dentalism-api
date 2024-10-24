"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokenFromRequest = exports.generateHash = exports.signToken = void 0;
const jwt_decode_1 = require("jwt-decode");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const signToken = ({ payload, options }) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};
exports.signToken = signToken;
const generateHash = (payload) => {
    return new Promise((resolve, reject) => {
        return bcrypt.hash(payload, 10)
            .then((hash) => resolve(hash))
            .catch((err) => reject(false));
    });
};
exports.generateHash = generateHash;
const decodeTokenFromRequest = (request) => {
    return (0, jwt_decode_1.jwtDecode)(String(request.headers.authorization).split(" ")[1]);
};
exports.decodeTokenFromRequest = decodeTokenFromRequest;
