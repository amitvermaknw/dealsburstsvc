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
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send('Unauthorized');
        }

        try {
            await admin.auth().verifyIdToken(token);
            next();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({ authStatus: false, msg: error.message })
            } else {
                res.status(500).send('An unknow error occured while token verification');
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
            debugger;
            if (localId) {
                const customToken = await admin.auth().createCustomToken(localId);
                const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseAPIKey}`, {
                    token: customToken,
                    returnSecureToken: true,
                });

                const idToken = response.data.idToken
                if (idToken) {
                    res.status(200).send({ token: idToken });
                }

                res.status(400).send({ msg: "Token not generated", token: false });
            } else {
                res.status(400).send({ msg: "Invalid email or password" });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({ authStatus: false, msg: error.message })
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
                res.status(500).send({ qStatus: false, msg: error.message })
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
                res.status(500).send({ qStatus: false, msg: error.message })
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }
}

export default AdminLoginServices;