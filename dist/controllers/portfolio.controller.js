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
exports.removeSingleData = exports.editManyData = exports.editSingleData = exports.addData = exports.getData = void 0;
const mongo_service_1 = require("@services/mongo.service");
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sortPayload = {}, dbPayload = {};
    if (req.query.sortBy) {
        sortPayload = { [String(req.query.sortBy)]: req.query.sortOrder == 'desc' ? -1 : 1 };
    }
    dbPayload = {
        collection: req.query.collection,
        find: req.query.find,
        sort: sortPayload,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10)
    };
    const data = yield (0, mongo_service_1.retrieveData)(dbPayload);
    if (data) {
        return res.status(200).json(data);
    }
    else {
        return res.status(404);
    }
});
exports.getData = getData;
const addData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collection, data } = req.body;
    let dataToArray = [];
    if (!collection) {
        return res.status(403).json({ message: 'Missing collection field.' });
    }
    if (!data) {
        return res.status(403).json({ message: 'Missing data field.' });
    }
    if (!Array.isArray(data)) {
        dataToArray = [data];
    }
    const results = yield (0, mongo_service_1.insertData)({
        collection,
        data: dataToArray.length > 0 ? dataToArray : data
    });
    if (results) {
        return res.status(200).json({ message: 'Tech stack has been added successfully.', trace: results });
    }
    else {
        return res.status(404).json({ message: 'An error occured while trying to add data.', trace: results });
    }
});
exports.addData = addData;
const editSingleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collection, row } = req.body;
    if (!collection) {
        return res.status(403).json({ message: 'Missing collection field.' });
    }
    if (!req.params.id) {
        return res.status(403).json({ message: 'Missing id field.' });
    }
    if (!row) {
        return res.status(403).json({ message: 'Missing row field.' });
    }
    const results = yield (0, mongo_service_1.updateSingleData)({
        collection: collection,
        id: req.params.id,
        field: row
    });
    if (results.acknowledged) {
        return res.status(200).json({ message: 'Single row has been updated successfully.', trace: results });
    }
    else {
        return res.status(404).json({ message: 'An error occured while trying to update single data.', trace: results });
    }
});
exports.editSingleData = editSingleData;
const editManyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collection, row, query } = req.body;
    if (!collection) {
        return res.status(403).json({ message: 'Missing collection field.' });
    }
    if (!row) {
        return res.status(403).json({ message: 'Missing row field.' });
    }
    if (!query) {
        return res.status(403).json({ message: 'Missing query field.' });
    }
    const results = yield (0, mongo_service_1.updateManyData)({
        collection: collection,
        field: row,
        query,
    });
    if (results.acknowledged) {
        return res.status(200).json({ message: 'Bulk rows have been updated successfully.', trace: results });
    }
    else {
        return res.status(404).json({ message: 'An error occured while trying to update single data.', trace: results });
    }
});
exports.editManyData = editManyData;
const removeSingleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collection, id } = req.query;
    const results = yield (0, mongo_service_1.deleteSingleData)({
        collection: collection,
        id: id
    });
    if (results.acknowledged && results.modifiedCount) {
        return res.status(200).json('Document was successfully removed.');
    }
    else {
        return res.status(404);
    }
});
exports.removeSingleData = removeSingleData;
