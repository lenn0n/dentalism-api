"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.loginWithEmail = void 0;
const auth_service_1 = require("@services/auth.service");
const loginWithEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email payload is provided
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "Please provide email address." });
    }
    const results = yield (0, auth_service_1.loginWithEmailService)(email);
    return res.status(results.code).json(Object.assign(Object.assign({}, results.json), { trace: 'loginWithEmail' }));
});
exports.loginWithEmail = loginWithEmail;
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if hash is in the payload
    const { hash } = req.body;
    if (!hash) {
        return res.status(400).json({ message: "Please provide login hash." });
    }
    const results = yield (0, auth_service_1.generateTokenService)(hash);
    return res.status(results.code).json(results.json);
});
exports.generateToken = generateToken;
