import { Request, Response } from "express";
import Config from "../../utils/config";
import CloudinaryUtil from "../../utils/cloudinaryUtil";
import { BannerListProps } from "../../Interface/dealsInterface";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";


const config = new Config();
const db = config.initConfig().db;
const docPath = "streetdeals_collection/streetdeals/banner_details";
let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData>;


class BannerServices {
    async fetchBanner(req: Request, res: Response) {
        try {
            const pageNo: number = parseInt(req.params.page);
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (req.params.state == 'start') {
                query = await db.collection(docPath)
                    .where("bstatus", "==", "active")
                    .orderBy("bid", "desc")
                    .limit(pageNo).get();
            } else if (req.params.state === 'next') {
                query = await db.collection(docPath)
                    .where("bstatus", "==", "active")
                    .orderBy("bid", "desc")
                    .startAfter(lastVisibleData)
                    .limit(pageNo).get();
            }
            const result: Array<BannerListProps> = [];

            query?.forEach((doc: { data: () => any, id: string }) => {
                lastVisibleData = query?.docs[query.docs.length - 1];
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                result.push(documentData as BannerListProps);
            });
            res.json(result);

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async addBanner(payload: BannerListProps, res: Response) {
        try {
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

    async updateBanner(payload: BannerListProps, res: Response) {
        try {
            const docRef = db.collection(docPath).doc(payload.documentId ? payload.documentId : '');
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
        const payload = req.body;

        console.log("payload", payload);
        const status = await cloudinary.deleteProductImage(payload.imageUrl);

        console.log("status", status);
        try {
            if (status.result === 'ok' || status.result === 'not found') {
                console.log("inside delete function", payload.bid);
                const docRef = db.collection(docPath).doc(payload.bid);
                await docRef.delete();
                res.status(200).send("Document deleted successfully")
            } else {
                res.status(500).send({ msg: `Not able to delete image and data: ${status.result}` });
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
                .where("bid", "==", req.params.bid)
                .get();

            const results: Array<FirebaseFirestore.DocumentData | string> = [];
            querySnap.forEach(doc => {
                results.push(doc.data());
                results.push({ documentId: doc.id });
            });
            res.status(200).json(results);

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