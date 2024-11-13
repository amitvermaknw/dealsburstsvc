import { Request, Response } from "express";
import Config from "../../utils/config";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { ProductCategory, ProductListProps } from "../../Interface/dealsInterface";
import CloudinaryUtil from "../../utils/cloudinaryUtil";

const config = new Config();
const db = config.initConfig().db;
const docPath = "streetdeals_collection/streetdeals/product_details";
const pCategory = "streetdeals_collection/streetdeals/product_category";


let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined;

class DealsServices {
    async getDeals(req: Request, res: Response) {
        try {
            const pageNo: number = parseInt(req.params.page);
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (req.params.state == 'start') {
                query = await db.collection(docPath)
                    .where("dealstatus", "==", "Active")
                    .orderBy("pid", "desc")
                    .limit(pageNo).get();
            } else if (req.params.state === 'next') {
                query = await db.collection(docPath)
                    .where("dealstatus", "==", "Active")
                    .orderBy("pid", "desc")
                    .startAfter(lastVisibleData)
                    .limit(pageNo).get();
            }
            const result: Array<ProductListProps> = [];

            query?.forEach((doc: { data: () => any, id: string }) => {
                lastVisibleData = query?.docs[query.docs.length - 1];
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                result.push(documentData as ProductListProps);
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

    async addDeals(jsonPayload: ProductListProps, res: Response) {
        const snapshot = await db.collection(docPath).add(jsonPayload);
        if (snapshot.id) {
            res.status(200).send({ msg: "Product added successfully" });
        } else {
            res.status(400).send({ msg: "Error while add transaction" });
        }
    }

    async updateDeals(jsonPayload: ProductListProps, res: Response) {
        const docRef = await db.collection(docPath).doc(jsonPayload.documentId);
        await docRef.update(jsonPayload);
        if (docRef.id) {
            res.status(200).send({ msg: "Product updated successfully" });
        } else {
            res.status(400).send({ msg: "Error while update deals transaction" });
        }
    }


    async getSingleDeals(req: Request, res: Response) {
        try {
            const querySnap = await db.collection(docPath)
                .where("pid", "==", req.params.pid)
                .get();

            // const results = new Map<string, FirebaseFirestore.DocumentData>();
            const results: Array<FirebaseFirestore.DocumentData | string> = [];
            querySnap.forEach(doc => {
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                results.push(documentData as ProductListProps);
            });
            // const finalList = Array.from(results.values()); 
            res.status(200).json(results);

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
        const payload = req.body;
        const status = await cloudinary.deleteProductImage(payload.imageUrl);
        try {
            if (status.result === 'ok') {
                const docRef = db.collection(docPath).doc(payload.pid);
                await docRef.delete();
                res.status(200).send({ msg: "Document deleted successfully" });
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

    async getDealsOnCategory(req: Request, res: Response) {
        try {
            const querySnap = await db.collection(docPath)
                .where("pcategory", "==", req.params.category)
                .limit(10)
                .get();

            const results: Array<FirebaseFirestore.DocumentData | string> = [];
            querySnap.forEach(doc => {
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                results.push(documentData as ProductListProps);
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

    async getDealsCategory(req: Request, res: Response) {
        try {

            console.log("inside categories");
            const querySnap = await db.collection(pCategory).get();

            const results: Array<FirebaseFirestore.DocumentData | string> = [];
            querySnap.forEach(doc => {
                const documentData = doc.data();
                documentData['documentId'] = doc.id;
                results.push(documentData as ProductCategory);
            });

            console.log("result", results);
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

export default DealsServices;