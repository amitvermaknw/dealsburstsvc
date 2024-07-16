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


const app: Express = express();

// Middleware for handling single file upload with field name 'image'
//const uploadSingleImage = upload.single('image');
app.use(express.json());
app.use("/api", router);


// app.post('/api/db/deals', async (req, res, next) => {
//     try {

//         const body = await getFieldsFromFormData(req, res, next)
//         console.log('MyFormData:>> ', body);

//         res.send({});

//         // // Access the file and other form data
//         // const file = req.file;
//         // const jsonData = req.body.jsonData ? JSON.parse(req.body.jsonData) : {};

//         // // Log the received data
//         // console.log('Received JSON Data:', jsonData);
//         // console.log('Received File:', file);

//         // // Send response
//         // res.json({ message: 'Form data received successfully', jsonData, file });
//     } catch (error) {
//         console.error('Error processing form data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.get("/health", (req, res) => {
    logger.log("Service is up and running");
    res.send("Service is up and running");
})
export const dealsburst = onRequest(app);
