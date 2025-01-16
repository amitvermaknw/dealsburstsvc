import { Request, Response } from "express";
import BannerServices from '../../services/db/bannerService';
import ReadMultipartData from "../../utils/readMultipartData";
import CloudinaryUtil from "../../utils/cloudinaryUtil";

const readMulti = new ReadMultipartData;
const bannerSvc = new BannerServices();

class Banners {
    async getBanner(req: Request, res: Response) {
        return await bannerSvc.fetchBanner(req, res);
    }

    async addBanner(req: Request, res: Response) {
        const { imageData, jsonPayload, imageInfo } = await readMulti.getFieldsFromFormData(req, res);
        const cloudinary = new CloudinaryUtil;
        if (imageData) {
            const uploadStatus = await cloudinary.uploadProductImage({ imageData, imageInfo }, 'banner')
            if (uploadStatus.code === 200) {

                console.log("banner url", uploadStatus.imageUrl);
                jsonPayload.bimageurl = uploadStatus.imageUrl;
                return await bannerSvc.addBanner(jsonPayload, res);
            } else {
                res.status(201).send({ msg: uploadStatus });
            }
        } else {
            res.status(201).send({ msg: "Not able to extract image" });
        }

    }

    async deleteBanner(req: Request, res: Response) {
        return await bannerSvc.deleteBanner(req, res);
    }

    async getSingleBanner(req: Request, res: Response) {
        return await bannerSvc.getSingleBanner(req, res);
    }

    async updateBanner(req: Request, res: Response) {
        const payload = req.body;
        if (Object.prototype.hasOwnProperty.call(payload, 'bimageurl')) {
            if (payload.bimageurl !== "") {
                console.log("payload", payload);
                return await bannerSvc.updateBanner(payload, res);
            } else {
                res.status(201).send({ msg: "Image url is not found while update." })
            }
        } else {
            const { imageData, jsonPayload, imageInfo } = await readMulti.getFieldsFromFormData(req, res);
            const cloudinary = new CloudinaryUtil;
            if (imageData) {
                const uploadStatus = await cloudinary.uploadProductImage({ imageData, imageInfo }, 'banner')
                if (uploadStatus.code === 200) {
                    jsonPayload.bimageurl = uploadStatus.imageUrl;
                    return await bannerSvc.updateBanner(jsonPayload, res);
                } else {
                    res.status(201).send({ msg: uploadStatus });
                }
            } else {
                res.status(201).send({ msg: "Not able to extract image" });
            }
        }
    }

}

export default Banners;