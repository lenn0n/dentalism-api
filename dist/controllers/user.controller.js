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
exports.getDentistAvailability = exports.retrieveDentist = exports.updateProfile = exports.retrieveProfile = void 0;
const user_service_1 = require("@services/user.service");
const { ObjectId } = require('mongodb');
const retrieveProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    if (req.query.email) {
        payload['find'] = { email: req.query.email };
    }
    const results = yield (0, user_service_1.retrieveProfileService)(payload);
    return res.status(results.code).json(results.json);
});
exports.retrieveProfile = retrieveProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    const id = req.body.id;
    const fields = req.body.fields;
    if (!id)
        return res.status(400).json({ message: "Please provide user ID." });
    else
        payload['id'] = req.body.id;
    if (!fields)
        return res.status(400).json({ message: "Please provide user ID." });
    else
        payload['fields'] = req.body.fields;
    const results = yield (0, user_service_1.updateProfileService)(payload);
    return res.status(results.code).json(results.json);
});
exports.updateProfile = updateProfile;
const retrieveDentist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    if (req.query.find) {
        payload['find'] = req.query.find;
    }
    const results = yield (0, user_service_1.retrieveDentistService)(payload);
    return res.status(results.code).json(results.json);
});
exports.retrieveDentist = retrieveDentist;
const getDentistAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email payload is provided
    const dentist_id = req.query.dentist_id;
    if (!dentist_id) {
        return res.status(404).json({ message: "Please provide a dentist." });
    }
    try {
        new ObjectId(dentist_id);
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid dentist." });
    }
    const date = req.query.date;
    if (!date) {
        return res.status(404).json({ message: "Please provide a date" });
    }
    const results = yield (0, user_service_1.getDentistAvailabilityService)({ dentist_id, date });
    return res.status(results.code).json(results.json);
});
exports.getDentistAvailability = getDentistAvailability;
