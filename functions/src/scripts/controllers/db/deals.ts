import { Request, Response } from "express";
import DealsServices from "../../services/db/dealsService";
import CloudinaryUtil from "../../utils/cloudinaryUtil";
import ReadMultipartData from "../../utils/readMultipartData";

const readMulti = new ReadMultipartData;

const dealsSvc = new DealsServices();

class Deals {
    async getDeals(req: Request, res: Response) {
        return await dealsSvc.getDeals(req, res);
    }

    async getDealDetails(req: Request, res: Response) {
        return await dealsSvc.getProductDetails(req, res);
    }

    async deleteDeals(req: Request, res: Response) {
        return await dealsSvc.deleteDeals(req, res);
    }

    async getSingleDeals(req: Request, res: Response) {
        return await dealsSvc.getSingleDeals(req, res);
    }

    async addDeals(req: Request, res: Response) {
        const payload = req.body;
        const { imageData, jsonPayload } = await readMulti.getFieldsFromFormData(req, res);

        const cloudinary = new CloudinaryUtil;

        console.log("payload1", payload);

        console.log("jsonPayload", jsonPayload);

        if (imageData) {
            console.log("payload.pimage.image", imageData);
            jsonPayload.pimageurl = await cloudinary.uploadProductImage(imageData, 'deals');
        }
        // else {
        //     console.log("payload.pimage.imageObject", payload.pimage.imageObject);
        //     payload.pimageurl = payload.pimage.imageObject;
        // }

        console.log("payload", jsonPayload);

        return await dealsSvc.addDeals(jsonPayload, res);
    }

    async updateDeals(req: Request, res: Response) {
        return await dealsSvc.updateDeals(req, res);
    }
}

export default Deals;