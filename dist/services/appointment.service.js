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
exports.cancelAppointmentService = exports.updateAppointmentService = exports.createAppointmentService = exports.bookAppointmentService = exports.retrieveAppointmentService = void 0;
const useJWT_1 = require("@hooks/useJWT");
const mongo_service_1 = require("@services/mongo.service");
const auth_service_1 = require("./auth.service");
const email_template_1 = require("@utils/email.template");
const { ObjectId } = require('mongodb');
const retrieveAppointmentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield (0, mongo_service_1.retrieveData)({
        collection: "appointments",
        find: payload.find,
        limit: payload.limit || 100,
        display: { availability: false }
    });
    let dentists = yield (0, mongo_service_1.retrieveData)({
        collection: "dentists",
        find: {},
        limit: 1000,
        display: { first_name: true, last_name: true, image: true }
    });
    if (appointment.length > 0) {
        let formattedAppointment = [];
        appointment.map((ap) => __awaiter(void 0, void 0, void 0, function* () {
            const dentist = dentists.filter((dentist) => String(dentist._id) == ap.dentist_id);
            formattedAppointment.push(Object.assign(Object.assign({}, ap), { start: `${ap.appointment_date} ${String(ap.start_time).length == 1 ? '0' + ap.start_time : ap.start_time}:00:00`, end: `${ap.appointment_date} ${String(ap.end_time).length == 1 ? '0' + ap.end_time : ap.end_time}:00:00`, title: `Dr. ${dentist[0].first_name}`, dentist: dentist[0] }));
        }));
        return {
            code: 200,
            json: {
                list: formattedAppointment
            }
        };
    }
    else {
        return {
            code: 404,
            json: {
                data: []
            }
        };
    }
});
exports.retrieveAppointmentService = retrieveAppointmentService;
const bookAppointmentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SLOT ALREADY TAKEN
    const appointmentSched = yield (0, mongo_service_1.retrieveData)({
        collection: 'appointments',
        find: {
            dentist_id: new ObjectId(payload.fields.dentist_id),
            appointment_date: payload.fields.appointment_date,
            start_time: payload.fields.start_time,
            end_time: payload.fields.end_time,
        },
        limit: 1000,
        display: { _id: true }
    });
    if (appointmentSched.length > 0) {
        return {
            code: 409,
            json: {
                message: "The slot time has already been taken."
            }
        };
    }
    // CREATE OR RETRIEVE USER
    const user_id = yield (0, auth_service_1.retrieveOrCreateUser)(payload.fields.email);
    // CREATE APPOINTMENT
    const createAppointment = yield (0, mongo_service_1.insertData)({
        collection: 'appointments',
        data: [Object.assign(Object.assign({}, payload.fields), { user_id: new ObjectId(user_id) })]
    });
    if (createAppointment) {
        const hash = yield (0, useJWT_1.generateHash)(payload.fields.email);
        // INSERT HASH TO DATABASE
        const createHashToDB = yield (0, mongo_service_1.insertData)({
            collection: 'hashes',
            data: [{
                    hash,
                    email: payload.fields.email,
                    date: new Date()
                }]
        });
        if (createHashToDB) {
            const loginLink = `${process.env.FRONTEND_CALLBACK_URI}?hash=${hash}`;
            const messageStatus = yield (0, auth_service_1.sendEmailMessage)({
                sendTo: payload.fields.email,
                subject: 'Login via Email',
                html: (0, email_template_1.generateHTMLForBooking)({ login_link: loginLink }),
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
                code: 409,
                json: {
                    message: "An error occured while trying to create appointment. Failed to create hash."
                }
            };
        }
    }
    else {
        return {
            code: 409,
            json: {
                message: "An error occured while trying to create appointment. Must be taken."
            }
        };
    }
});
exports.bookAppointmentService = bookAppointmentService;
const createAppointmentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SLOT ALREADY TAKEN
    const appointmentSched = yield (0, mongo_service_1.retrieveData)({
        collection: 'appointments',
        find: {
            dentist_id: new ObjectId(payload.fields.dentist_id),
            appointment_date: payload.fields.appointment_date,
            start_time: payload.fields.start_time,
            end_time: payload.fields.end_time,
        },
        limit: 1000,
        display: { _id: true }
    });
    if (appointmentSched.length > 0) {
        return {
            code: 409,
            json: {
                message: "The slot time has already been taken."
            }
        };
    }
    // CREATE APPOINTMENT
    const createAppointment = yield (0, mongo_service_1.insertData)({
        collection: 'appointments',
        data: [payload.fields]
    });
    if (createAppointment) {
        return {
            code: 200,
            json: {
                message: "Appointment was successfully created."
            }
        };
    }
    else {
        return {
            code: 409,
            json: {
                message: "An error occured while trying to create appointment. Must be taken."
            }
        };
    }
});
exports.createAppointmentService = createAppointmentService;
const updateAppointmentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF APPOINTMENT IS OWNED BY REQUESTER
    const appointment = yield (0, mongo_service_1.retrieveData)({
        collection: 'appointments',
        find: {
            _id: new ObjectId(payload.id),
            email: payload.token.email,
            user_id: new ObjectId(payload.token.user_id)
        },
        limit: 1,
        display: { _id: true }
    });
    if (appointment.length === 0) {
        return {
            code: 401,
            json: {
                status: 401,
                message: "This is not your appointment."
            }
        };
    }
    // UPDATE APPOINTMENT DETAILS
    const results = yield (0, mongo_service_1.updateSingleData)({
        collection: 'appointments',
        id: payload.id,
        field: payload.fields
    });
    if (results.acknowledged) {
        return {
            code: 200,
            json: {
                status: 200,
                message: "Appointment was successfully updated."
            }
        };
    }
    else {
        return {
            code: 400,
            json: {
                status: 400,
                message: "An error was occurred."
            }
        };
    }
});
exports.updateAppointmentService = updateAppointmentService;
const cancelAppointmentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF APPOINTMENT IS OWNED BY REQUESTER
    const appointment = yield (0, mongo_service_1.retrieveData)({
        collection: 'appointments',
        find: {
            _id: new ObjectId(payload.id),
            email: payload.token.email,
            user_id: new ObjectId(payload.token.user_id)
        },
        limit: 1,
        display: { _id: true }
    });
    if (appointment.length === 0) {
        return {
            code: 401,
            json: {
                message: "This is not your appointment."
            }
        };
    }
    // REMOVE THE APPOINTMENT
    const results = yield (0, mongo_service_1.deleteSingleData)({
        collection: 'appointments',
        id: new ObjectId(payload.id),
    });
    console.log(results);
    if (results.acknowledged && results.deletedCount) {
        return {
            code: 200,
            json: {
                message: "Appointment was successfully cancelled."
            }
        };
    }
    else {
        return {
            code: 401,
            json: {
                message: "The appointment is no longer exists."
            }
        };
    }
});
exports.cancelAppointmentService = cancelAppointmentService;
