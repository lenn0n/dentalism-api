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
exports.cancelAppointment = exports.updateAppointment = exports.createAppointment = exports.retrieveAppointment = exports.bookAppointment = void 0;
const useJWT_1 = require("@hooks/useJWT");
const appointment_service_1 = require("@services/appointment.service");
const { ObjectId } = require('mongodb');
const retrieveAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    let token = (0, useJWT_1.decodeTokenFromRequest)(req);
    // INCLUDE REQUEST HEADERS
    if (token) {
        payload = Object.assign(Object.assign({}, payload), { find: { email: token === null || token === void 0 ? void 0 : token.email } });
    }
    // Filter by dentist
    if (req.query.dentist_id) {
        payload['find'] = Object.assign(Object.assign({}, payload.find), { dentist_id: req.query.dentist_id });
    }
    // Filter by date
    if (req.query.appointment_date) {
        payload['find'] = Object.assign(Object.assign({}, payload.find), { appointment_date: req.query.appointment_date });
    }
    const results = yield (0, appointment_service_1.retrieveAppointmentService)(payload);
    return res.status(results.code).json(results.json);
});
exports.retrieveAppointment = retrieveAppointment;
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {
        fields: {}
    };
    // DESTRUCTURE REQUEST BODY
    const { dentist_id, appointment_date, start_time, end_time, notes, email } = req.body;
    // INCLUDE EMAIL
    if (!email) {
        return res.status(400).json({ message: "Please provide email address." });
    }
    else
        payload['fields']['email'] = email;
    // VALIDATE DENTIST
    try {
        if (!dentist_id) {
            return res.status(400).json({ message: "Please provide dentist." });
        }
        else
            payload['fields']['dentist_id'] = new ObjectId(dentist_id);
    }
    catch (error) {
        return res.status(400).json({ message: "Please provide a valid dentist." });
    }
    // INCLUDE DATE
    if (!appointment_date) {
        return res.status(400).json({ message: "Please provide a date." });
    }
    else
        payload['fields']['appointment_date'] = appointment_date;
    // INCLUDE START TIME
    if (!start_time) {
        return res.status(400).json({ message: "Please provide a start time." });
    }
    else
        payload['fields']['start_time'] = start_time;
    // INCLUDE END TIME
    if (!end_time) {
        return res.status(400).json({ message: "Please provide a end time." });
    }
    else
        payload['fields']['end_time'] = end_time;
    // VALIDATE START AND END TIME
    if (start_time >= end_time) {
        return res.status(400).json({ message: "Please provide a valid appointment time." });
    }
    // OPTIONALLY ADD NOTES IF SPECIFIED
    if (notes) {
        payload['fields']['notes'] = notes;
    }
    const results = yield (0, appointment_service_1.bookAppointmentService)(payload);
    return res.status(results.code).json(results.json);
});
exports.bookAppointment = bookAppointment;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {
        fields: {}
    };
    let token = (0, useJWT_1.decodeTokenFromRequest)(req);
    // INCLUDE REQUEST HEADERS
    if (token) {
        payload['fields'] = Object.assign(Object.assign({}, payload.fields), { email: token.email, user_id: new ObjectId(token.user_id) });
    }
    // DESTRUCTURE REQUEST BODY
    const { dentist_id, appointment_date, start_time, end_time, notes } = req.body;
    // VALIDATE DENTIST
    try {
        if (!dentist_id) {
            return res.status(400).json({ message: "Please provide dentist." });
        }
        else
            payload['fields']['dentist_id'] = new ObjectId(dentist_id);
    }
    catch (error) {
        return res.status(400).json({ message: "Please provide a valid dentist." });
    }
    // INCLUDE DATE
    if (!appointment_date) {
        return res.status(400).json({ message: "Please provide a date." });
    }
    else
        payload['fields']['appointment_date'] = appointment_date;
    // INCLUDE START TIME
    if (!start_time) {
        return res.status(400).json({ message: "Please provide a start time." });
    }
    else
        payload['fields']['start_time'] = start_time;
    // INCLUDE END TIME
    if (!end_time) {
        return res.status(400).json({ message: "Please provide a end time." });
    }
    else
        payload['fields']['end_time'] = end_time;
    // VALIDATE START AND END TIME
    if (start_time >= end_time) {
        return res.status(400).json({ message: "Please provide a valid appointment time." });
    }
    // OPTIONALLY ADD NOTES IF SPECIFIED
    if (notes) {
        payload['fields']['notes'] = notes;
    }
    const results = yield (0, appointment_service_1.createAppointmentService)(payload);
    return res.status(results.code).json(results.json);
});
exports.createAppointment = createAppointment;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    let token = (0, useJWT_1.decodeTokenFromRequest)(req);
    // INCLUDE REQUEST HEADERS
    if (token) {
        payload = Object.assign(Object.assign({}, payload), { token });
    }
    const { id, fields } = req.body;
    // VALIDATE APPOINTMENT ID
    try {
        if (!id) {
            return res.status(400).json({ message: "Please provide a appointment id." });
        }
        else {
            new ObjectId(id);
            payload = Object.assign(Object.assign({}, payload), { id });
        }
    }
    catch (error) {
        return res.status(400).json({ message: "Please provide a valid ID of appointment." });
    }
    // INCLUDE FIELDS
    if (!fields) {
        return res.status(400).json({ message: "Please provide a fields." });
    }
    else
        payload['fields'] = fields;
    const results = yield (0, appointment_service_1.updateAppointmentService)(payload);
    return res.status(results.code).json(results.json);
});
exports.updateAppointment = updateAppointment;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    let token = (0, useJWT_1.decodeTokenFromRequest)(req);
    // INCLUDE REQUEST HEADERS
    if (token) {
        payload = Object.assign(Object.assign({}, payload), { token });
    }
    const { id } = req.body;
    // VALIDATE APPOINTMENT ID
    try {
        if (!id) {
            return res.status(400).json({ message: "Please provide a appointment id." });
        }
        else {
            new ObjectId(id);
            payload = Object.assign(Object.assign({}, payload), { id });
        }
    }
    catch (error) {
        return res.status(400).json({ message: "Please provide a valid ID of appointment." });
    }
    const results = yield (0, appointment_service_1.cancelAppointmentService)(payload);
    return res.status(results.code).json(results.json);
});
exports.cancelAppointment = cancelAppointment;
