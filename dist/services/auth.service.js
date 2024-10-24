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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveOrCreateUser = exports.generateTokenService = exports.loginWithEmailService = exports.sendEmailMessage = exports.loginWithPassword = void 0;
const useJWT_1 = require("@hooks/useJWT");
const useNodeMailer_1 = __importDefault(require("@hooks/useNodeMailer"));
const mongo_service_1 = require("@services/mongo.service");
const email_template_1 = require("@utils/email.template");
const loginWithPassword = ({ password, expiresIn }) => {
    if (btoa(password) !== btoa(process.env.PASSWORD) || !password) {
        return false;
    }
    const userPublicData = {
        hash: btoa(String(process.env.ACCESS_TOKEN_SECRET))
    };
    let tokenOptions = {
        expiresIn: expiresIn || '24h'
    };
    return (0, useJWT_1.signToken)({ payload: userPublicData, options: tokenOptions });
};
exports.loginWithPassword = loginWithPassword;
const sendEmailMessage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sendTo, subject, html }) {
    const { sendEmail } = yield (0, useNodeMailer_1.default)({
        sendTo,
        subject,
        html,
    });
    return yield sendEmail();
});
exports.sendEmailMessage = sendEmailMessage;
const loginWithEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // GENERATE HASH
    const hash = yield (0, useJWT_1.generateHash)(email);
    if (!hash) {
        return {
            code: 400,
            json: { message: "Failed to create hash." }
        };
    }
    // INSERT TO DATABASE
    const results = yield (0, mongo_service_1.insertData)({
        collection: 'hashes',
        data: [{
                hash,
                email,
                date: new Date()
            }]
    });
    // PREPARE FOR SENDING LOGIN LINK TO USER EMAIL ADDRESS
    if (results) {
        const loginLink = `${process.env.FRONTEND_CALLBACK_URI}?hash=${hash}`;
        const messageStatus = yield (0, exports.sendEmailMessage)({
            sendTo: email,
            subject: 'Login via Email',
            html: (0, email_template_1.generateHTMLForLogin)({ login_link: loginLink }),
        });
        if (!messageStatus) {
            return {
                code: 400,
                json: { message: "There was an error occurred when sending you email." }
            };
        }
        else {
            return {
                code: 200,
                json: { message: 'The login link was successfully sent to your email address.' }
            };
        }
    }
    else {
        return {
            code: 500,
            json: { message: "An error occured while trying to fulfill your request." }
        };
    }
});
exports.loginWithEmailService = loginWithEmailService;
const generateTokenService = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF HASH IS IN THE DATABASE
    const results = yield (0, mongo_service_1.retrieveData)({
        collection: 'hashes',
        find: { hash },
        limit: 1
    });
    // GENERATE JWT 
    if (results.length > 0) {
        const email = results[0].email;
        const user_id = yield (0, exports.retrieveOrCreateUser)(email);
        let tokenOptions = {
            expiresIn: '24h'
        };
        const token = (0, useJWT_1.signToken)({ payload: { email, user_id }, options: tokenOptions });
        return {
            code: 200,
            json: { token }
        };
    }
    else {
        return {
            code: 400,
            json: { message: "Unable to verify hash. Please request access again." }
        };
    }
});
exports.generateTokenService = generateTokenService;
const retrieveOrCreateUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield (0, mongo_service_1.retrieveData)({
        collection: 'users',
        find: { email },
        limit: 1
    });
    if ((userProfile === null || userProfile === void 0 ? void 0 : userProfile.length) > 0) {
        return String(userProfile[0]._id).replace("new ObjectId('", "").replace("')", "");
    }
    else {
        return yield (0, mongo_service_1.insertData)({
            collection: 'users',
            data: [{
                    email,
                }]
        }).then((data) => {
            return String(data.insertedIds['0']).replace("new ObjectId('", "").replace("')", "");
        });
    }
});
exports.retrieveOrCreateUser = retrieveOrCreateUser;
