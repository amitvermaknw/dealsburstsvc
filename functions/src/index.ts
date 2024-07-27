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
import cors from 'cors';

const app: Express = express();
app.use(cors());

// Middleware for handling single file upload with field name 'image'
//const uploadSingleImage = upload.single('image');
app.use(express.json());
app.use("/api", router);

app.get("/health", (req, res) => {
    logger.log("Service is up and running");
    res.send("Service is up and running");
})
export const dealsburst = onRequest(app);
