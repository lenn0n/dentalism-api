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
exports.getDentistAvailabilityService = exports.retrieveDentistService = exports.updateProfileService = exports.retrieveProfileService = void 0;
const mongo_service_1 = require("@services/mongo.service");
const { ObjectId } = require('mongodb');
const retrieveProfileService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, mongo_service_1.retrieveData)({
        collection: "users",
        find: payload.find,
        limit: payload.limit || 100,
        display: { availability: false }
    });
    if (user.length > 0) {
        return {
            code: 200,
            json: {
                list: user
            }
        };
    }
    else {
        return {
            code: 400,
            json: {
                data: []
            }
        };
    }
});
exports.retrieveProfileService = retrieveProfileService;
const updateProfileService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, mongo_service_1.updateSingleData)({
        collection: 'users',
        id: payload.id,
        field: payload.fields
    });
    if (results.acknowledged) {
        return {
            code: 200,
            json: {
                message: "Profile updated successfully."
            }
        };
    }
    else {
        return {
            code: 201,
            json: {
                message: "Profile was already updated."
            }
        };
    }
});
exports.updateProfileService = updateProfileService;
const retrieveDentistService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const dentists = yield (0, mongo_service_1.retrieveData)({
        collection: "dentists",
        find: payload.find,
        limit: payload.limit || 100,
        display: { availability: false }
    });
    if (dentists.length > 0) {
        return {
            code: 200,
            json: {
                list: dentists
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
exports.retrieveDentistService = retrieveDentistService;
const getDentistAvailabilityService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ dentist_id, date }) {
    // GET THE DAY OF THE DATE
    const dateDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(String(date)).getDay()];
    // RETURN DENTIST WITH SPECIFIC DAY AVAILABILITY
    const dentist = yield (0, mongo_service_1.retrieveData)({
        collection: "dentists",
        find: {
            _id: new ObjectId(dentist_id),
            'availability.day': dateDay
        },
        limit: 1,
        display: { availability: true, _id: false }
    });
    // GET THE APPOINTMENT SCHED FOR THE DAY
    const appointmentSched = yield (0, mongo_service_1.retrieveData)({
        collection: 'appointments',
        find: {
            dentist_id: new ObjectId(dentist_id),
            appointment_date: date
        },
        limit: 1000,
        display: { _id: false }
    });
    // FIND AVAILABLE SLOT FOR THE DAY
    let availableSlots = [];
    if (dentist.length > 0) {
        let todaySchedule = dentist[0].availability.filter((av) => av.day === dateDay)[0];
        for (let index = todaySchedule.start_time; index < todaySchedule.end_time; index++) {
            if (appointmentSched.length > 0) {
                if (appointmentSched.filter(((as) => as.start_time == index)).length === 0) {
                    availableSlots.push({
                        start_time: index,
                        end_time: index + 1,
                        name: `${index}:00 - ${index + 1}:00`,
                        value: `${index},${index + 1}`
                    });
                }
            }
            else {
                availableSlots.push({
                    start_time: index,
                    end_time: index + 1,
                    name: `${index}:00 - ${index + 1}:00`,
                    value: `${index},${index + 1}`
                });
            }
        }
    }
    return {
        code: 200,
        json: {
            date: date,
            day: dateDay,
            list: availableSlots
        }
    };
});
exports.getDentistAvailabilityService = getDentistAvailabilityService;
