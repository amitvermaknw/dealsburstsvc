import { Request, Response } from "express";
import Config from "../../utils/config";

const config = new Config();
const db = config.initConfig().db;

class SubscriberServices {
    async addSub(req: Request, res: Response) {
        try {

            const docRef = await db.collection("streetdeals_collection/streetdeals/subscriber_list").add(req.body);

            if (docRef.id) {
                res.status(200).send({ msg: "Subscriber added successfully" });
            } else {
                res.status(400).send({ msg: "Subscriber added successfully" });
            }

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({ msg: `Error getting documents: ${error.message}` });
            } else {
                res.status(500).send({ msg: `An unknow error occured` });
            }
        }
    }
}

export default SubscriberServices;