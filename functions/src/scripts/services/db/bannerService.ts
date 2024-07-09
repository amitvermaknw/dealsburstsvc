import { Request, Response } from "express";
import Config from "../../utils/config";
import CloudinaryUtil from "../../utils/cloudinaryUtil";

const config = new Config();
const db = config.initConfig();
const docPath = "streetdeals_collection/streetdeals/banner_details";


class BannerServices {
    async fetchBanner(req: Request, res: Response) {
        try {
            const snapshot = await db.collection(docPath).get();
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

            if (payload.bimage.image) {
                payload.bimageurl = await cloudinary.uploadProductImage(payload.bimage, 'deals');
            } else {
                payload.bimageurl = payload.bimage.imageObject;
            }

            const snapshot = await db.collection(docPath).add(payload);
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

    async updateBanner(req: Request, res: Response) {
        try {
            const payload = req.body();
            const cloudinary = new CloudinaryUtil;

            if (payload.bimage.image) {
                payload.bimageurl = await cloudinary.uploadProductImage(payload.bimage, 'deals');
            } else {
                payload.bimageurl = payload.bimage.imageObject;
            }

            const docRef = db.collection(docPath).doc(payload.documentId);
            await docRef.update(payload);

            if (docRef.id) {
                res.status(200).send({ msg: "Banner updated successfully" });
            } else {
                res.status(400).send({ msg: "Error while update banner transaction" });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }


    async deleteBanner(req: Request, res: Response) {
        const cloudinary = new CloudinaryUtil;
        const payload = req.body();
        const status = await cloudinary.deleteProductImage(payload.imageUrl);
        try {
            if (status === true) {
                const docRef = db.collection(docPath).doc(payload.pid);
                await docRef.delete();
                res.status(200).send("Document deleted successfully")
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async getSingleBanner(req: Request, res: Response) {
        try {
            const querySnap = await db.collection(docPath)
                .where("urlstring", "==", req.params.bid)
                .get();

            const results = new Map<string, FirebaseFirestore.DocumentData>();
            querySnap.forEach(doc => {
                results.set(doc.id, doc.data());
            });
            const finalList = Array.from(results.values());
            res.status(200).json(finalList);

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