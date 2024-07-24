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
                res.status(201).send({ msg: "Image upload failed" });
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
}

export default Banners;