import { NextFunction, Request, Response } from "express";
import Config from "../../utils/config";
import { firebaseConfigKeys } from "../../../../firebaseConfig";
import axios from "axios";


const config = new Config();
const db = config.initConfig().db;
const admin = config.initConfig().admin;
const docPath = "streetdeals_collection/streetdeals/admin_token";
const firebaseAPIKey = firebaseConfigKeys.apiKey;


class AdminLoginServices {

    async validateToken(req: Request, res: Response, next: NextFunction) {
        const userSessionToken = req.headers.authorization;

        if (!userSessionToken) {
            return res.status(401).send('Unauthorized');
        }
        try {
            const decodeToken = await admin.auth().verifyIdToken(userSessionToken);
            console.log("decodeToken", decodeToken);
            next();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Getting error during login: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`, {
                email,
                password,
                returnSecureToken: true
            });

            const { localId } = response.data;
            if (localId) {
                const customToken = await admin.auth().createCustomToken(localId);
                res.json({ customToken });
            } else {
                res.status(400).send({ msg: "Invalid email or password" });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Getting error during login: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async addAdminLogToken(req: Request, res: Response) {
        try {
            const payload = req.body();
            const snapshot = await db.collection(docPath).add(payload);
            if (snapshot.id) {
                res.status(200).send(snapshot.id);
            } else {
                res.status(400).json({ msg: "Error while add transaction" });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async updateAdminTokenLog(req: Request, res: Response) {
        try {
            const snapshot = await db.collection(docPath)
                .where("status", "==", true).get();

            snapshot.forEach(async (rec) => {
                const docRef = await db.collection(docPath).doc(rec.id);
                await docRef.update({
                    status: false,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }
}

export default AdminLoginServices;