import { Request, Response } from "express";
import Config from "../../utils/config";

const config = new Config();
const db = config.initConfig();
const docPath = "streetdeals_collection/streetdeals/admin_token";


class AdminLoginServices {
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