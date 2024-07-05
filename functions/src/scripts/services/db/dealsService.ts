import { Request, Response } from "express";
import Config from "../../utils/config";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { ProductListProps } from "../../Interface/dealsInterface";

const config = new Config();
const db = config.initConfig();

let lastVisibleData: QueryDocumentSnapshot<DocumentData, DocumentData>;

class DealsServices {
    async getDeals(req: Request, res: Response) {
        try {
            const param: number = parseInt(req.params.page);
            let query: QuerySnapshot<DocumentData, DocumentData> | undefined = undefined;

            if (req.params.state == 'start') {
                query = await db.collection("streetdeals_collection/streetdeals/product_details")
                    .where("dealstatus", "==", "Active")
                    .orderBy("pid", "desc")
                    .limit(param).get();
            } else if (req.params.state === 'next') {
                query = await db.collection("streetdeals_collection/streetdeals/product_details")
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
            res.json(result);

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