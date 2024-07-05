import { Request, Response } from "express";
import Config from "../../utils/config";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { ProductListProps } from "../../Interface/dealsInterface";
import CloudinaryUtil from "../../utils/cloudinaryUtil";

const config = new Config();
const db = config.initConfig();
const docPath = "streetdeals_collection/streetdeals/product_details";

let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData>;

class DealsServices {
    async getDeals(req: Request, res: Response) {
        try {
            const param: number = parseInt(req.params.page);
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (req.params.state == 'start') {
                query = await db.collection(docPath)
                    .where("dealstatus", "==", "Active")
                    .orderBy("pid", "desc")
                    .limit(param).get();
            } else if (req.params.state === 'next') {
                query = await db.collection(docPath)
                    .where("dealstatus", "==", "Active")
                    .orderBy("pid", "desc")
                    .startAfter(lastVisibleData)
                    .limit(param).get();
            }
            const result: Array<ProductListProps> = [];

            query?.forEach((doc: { data: () => any, id: string }) => {
                lastVisibleData = query.docs[query.docs.length - 1];
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                result.push(documentData as ProductListProps);
            });
            console.log("deals list")
            res.json(result);

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(`Error getting documents: ${error.message}`)
            } else {
                res.status(500).send('An unknow error occured');
            }
        }
    }

    async getProductDetails(req: Request, res: Response) {
        try {
            const querySnapURLString = await db.collection(docPath)
                .where("urlstring", "==", req.params.pid)
                .get();
            const querySnapPId = await db.collection(docPath)
                .where("pid", "==", req.params.pid)
                .get();
            const results = new Map<string, FirebaseFirestore.DocumentData>();
            querySnapURLString.forEach(doc => results.set(doc.id, doc.data()));
            querySnapPId.forEach(doc => {
                if (!results.has(doc.id)) {
                    results.set(doc.id, doc.data());
                }
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

    async addUpdateDeals(req: Request, res: Response) {
        const payload = req.body();
        const cloudinary = new CloudinaryUtil;
        if (payload.callType === 'add') {
            payload.pimageurl = await cloudinary.uploadProductImage(payload.pimage, 'deals');
        } else if (payload.callType === 'update') {
            if (payload.pimage.image) {
                payload.pimageurl = await cloudinary.uploadProductImage(payload.pimage, 'deals');
            } else {
                payload.pimageurl = payload.pimage.imageObject;
            }
        }
        const snapshot = await db.collection(docPath).add(payload);
        if (snapshot.id) {
            res.status(200).send({ msg: "Product added/update successfully" });
        } else {
            res.status(400).send({ msg: "Error while add transaction" });
        }
    }

    async getSingleDeals(req: Request, res: Response) {
        try {
            const querySnap = await db.collection(docPath)
                .where("urlstring", "==", req.params.pid)
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

    async deleteDeals(req: Request, res: Response) {
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
}

export default DealsServices;