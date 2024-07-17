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
        // const payload = req.body;
        const { imageData, jsonPayload, imageInfo } = await readMulti.getFieldsFromFormData(req, res);
        const cloudinary = new CloudinaryUtil;
        if (imageData) {
            const uploadStatus = await cloudinary.uploadProductImage({ imageData, imageInfo }, 'deals')
            if (uploadStatus.code === 200) {
                console.log("uploadStatus.imageUrl", uploadStatus.imageUrl);
                jsonPayload.pimageurl = uploadStatus.imageUrl;
                return await dealsSvc.addDeals(jsonPayload, res);
            } else {
                res.status(201).send({ msg: "Image upload failed" });
            }
        } else {
            res.status(201).send({ msg: "Not able to extract image" });
        }
    }

    async updateDeals(req: Request, res: Response) {
        return await dealsSvc.updateDeals(req, res);
    }
}

export default Deals;