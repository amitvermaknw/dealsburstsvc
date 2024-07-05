import { Request, Response } from "express";
import Config from "../../utils/config";

const config = new Config();
const db = config.initConfig();

class BannerServices {
    async fetchBannerService(req: Request, res: Response) {
        try {
            const snapshot = await db.collection("streetdeals_collection/streetdeals/banner_details").get();
            const data: { id: string, [key: string]: any }[] = [];
            snapshot.forEach((doc: { id: string, data(): {} }) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            res.json(data);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }
}

export default BannerServices;