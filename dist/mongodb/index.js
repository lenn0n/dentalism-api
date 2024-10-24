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
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// Init Database URI and other options
const client = new MongoClient(process.env.MONGO_DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// Expose for global use (mongoDB)
var dbConnection;
// Handle connections
module.exports = {
    connectToDB: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (dbName = undefined, callback) {
        return yield client.connect()
            .then((client) => {
            dbConnection = client.db(dbName);
            return callback();
        })
            .catch((err) => {
            return callback(err);
        });
    }),
    mongoDB: () => dbConnection
};
