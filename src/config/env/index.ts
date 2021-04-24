export const config = require("dotenv").config().parsed;
export const isProduction = process.env.NODE_ENV === "production";