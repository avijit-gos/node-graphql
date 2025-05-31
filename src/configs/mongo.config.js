/** @format */

const mongoose = require("mongoose");
const { DB_URL } = require("../constants");

mongoose.connect(DB_URL);
mongoose.connection.on("error", () => console.log("DB is not connected"));
mongoose.connection.on("connected", () => console.log("DB is connected"));
