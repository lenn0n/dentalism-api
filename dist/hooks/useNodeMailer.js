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
exports.useNodeMailer = void 0;
const nodemailer = require('nodemailer');
const useNodeMailer = ({ sendTo, subject, html }) => {
    // Create transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Using Gmail as the email service
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PW,
        },
    });
    // Setup email options
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: sendTo,
        subject,
        html: html,
    };
    const sendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(true);
            });
        });
    });
    return {
        sendEmail
    };
};
exports.useNodeMailer = useNodeMailer;
exports.default = exports.useNodeMailer;
