"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("@routes/auth"));
const appointment_1 = __importDefault(require("@routes/appointment"));
const user_1 = __importDefault(require("@routes/user"));
const cors_1 = __importDefault(require("cors"));
// Express Initialization
const app = (0, express_1.default)();
const expressParseOptions = {
    limit: '500mb',
};
// Mongo DB Initialization
const { connectToDB } = require("@mongodb");
// Utils
require('@utils/custom.console');
require('dotenv').config();
// Express Options
app.use(express_1.default.json(expressParseOptions));
// Static files
// app.use(express.static(''))
// Allow access to req.body
app.use(express_1.default.urlencoded({ extended: true }));
// Allow CORS
app.use((0, cors_1.default)());
// RESTful API
app.use("/api/v1", auth_1.default);
app.use("/api/v1", appointment_1.default);
app.use("/api/v1", user_1.default);
// Connect to Mongo and start the server
connectToDB("dentalista", (err) => {
    if (!err) {
        // Start server
        app.listen(process.env.SERVER_PORT, () => {
            console.info(`API is now running on port ${process.env.SERVER_PORT}. MongoDB was also initialized.`);
        });
    }
    else {
        console.error(`An error occured while trying to connect to MongoDB URI. ${process.env.MONGO_DB_URI}`);
    }
});
