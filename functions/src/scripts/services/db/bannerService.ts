import { Request, Response } from "express";
import Config from "../../utils/config";
import CloudinaryUtil from "../../utils/cloudinaryUtil";

const config = new Config();
const db = config.initConfig();

class BannerServices {
    async fetchBanner(req: Request, res: Response) {
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

    async addBanner(req: Request, res: Response) {
        try {
            const payload = req.body();
            const cloudinary = new CloudinaryUtil;

            if (payload.callType === 'add') {
                payload.bimageurl = await cloudinary.uploadProductImage(payload.bimage, 'deals');
            } else if (payload.callType === 'update') {
                if (payload.bimage.image) {
                    payload.bimageurl = await cloudinary.uploadProductImage(payload.bimage, 'deals');
                } else {
                    payload.bimageurl = payload.bimage.imageObject;
                }
            }

            const snapshot = await db.collection("streetdeals_collection/streetdeals/banner_details").add(payload);
            if (snapshot.id) {
                res.status(200).send({ msg: "Banner added successfully" });
            } else {
                res.status(400).send({ msg: "Error while add transaction" });
            }
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