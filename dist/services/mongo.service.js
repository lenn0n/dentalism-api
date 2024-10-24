"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyData = exports.deleteSingleData = exports.updateManyData = exports.updateSingleData = exports.insertData = exports.retrieveData = void 0;
const { mongoDB } = require("@mongodb");
const { ObjectId } = require('mongodb');
const retrieveData = (data) => {
    const { collection, find, sort, page, limit, display } = data;
    return mongoDB()
        .collection(collection)
        .find(find, { projection: display })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.retrieveData = retrieveData;
const insertData = ({ collection, data }) => {
    return mongoDB()
        .collection(collection)
        .insertMany(data)
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.insertData = insertData;
const updateSingleData = ({ collection, id, field }) => {
    return mongoDB()
        .collection(collection)
        .updateOne({ _id: new ObjectId(id) }, { $set: field })
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.updateSingleData = updateSingleData;
const updateManyData = ({ collection, query, field }) => {
    return mongoDB()
        .collection(collection)
        .updateMany(query, { $set: field })
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.updateManyData = updateManyData;
const deleteSingleData = ({ collection, id }) => {
    return mongoDB()
        .collection(collection)
        .deleteOne({ _id: new ObjectId(id) })
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.deleteSingleData = deleteSingleData;
const deleteManyData = ({ collection, query }) => {
    return mongoDB()
        .collection(collection)
        .deleteMany(query)
        .then((data) => {
        return data;
    })
        .catch((err) => {
        return [];
    });
};
exports.deleteManyData = deleteManyData;
