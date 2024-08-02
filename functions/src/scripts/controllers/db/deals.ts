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

    async getDealsOnCategory(req: Request, res: Response) {
        return await dealsSvc.getDealsOnCategory(req, res);
    }

    async getDealsCategory(req: Request, res: Response) {
        return await dealsSvc.getDealsCategory(req, res);
    }

    async addDeals(req: Request, res: Response) {
        const { imageData, jsonPayload, imageInfo } = await readMulti.getFieldsFromFormData(req, res);
        const cloudinary = new CloudinaryUtil;
        if (imageData) {
            const uploadStatus = await cloudinary.uploadProductImage({ imageData, imageInfo }, 'deals')
            if (uploadStatus.code === 200) {
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
        const payload = req.body;
        if (Object.prototype.hasOwnProperty.call(payload, 'pimageurl')) {
            if (payload.pimageurl !== "") {
                console.log("payload", payload);
                return await dealsSvc.updateDeals(payload, res);
            } else {
                res.status(201).send({ msg: "Image url is not found while update." })
            }
        } else {
            const { imageData, jsonPayload, imageInfo } = await readMulti.getFieldsFromFormData(req, res);
            const cloudinary = new CloudinaryUtil;
            if (imageData) {
                const uploadStatus = await cloudinary.uploadProductImage({ imageData, imageInfo }, 'deals')
                if (uploadStatus.code === 200) {
                    jsonPayload.pimageurl = uploadStatus.imageUrl;
                    return await dealsSvc.updateDeals(jsonPayload, res);
                } else {
                    res.status(201).send({ msg: "Image upload failed" });
                }
            } else {
                res.status(201).send({ msg: "Not able to extract image" });
            }
        }
    }
}

export default Deals;