import express from "express";
import { Commenter } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const CommenterRouter = express();


export { CommenterRouter };
