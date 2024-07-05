/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express, { Express } from "express";
import router from "./Router";
// import Config from "./scripts/utils/config";

// const config = new Config;
// config.initConfig();

const app: Express = express();
app.use(express.json());
app.use("/api", router);

export const dealsburst = onRequest(app);
