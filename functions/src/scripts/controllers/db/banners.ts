import { Request, Response } from "express";
import BannerServices from '../../services/db/bannerService';

const bannerSvc = new BannerServices();

class Banners {
    async getBanner(req: Request, res: Response) {
        return await bannerSvc.fetchBanner(req, res);
    }

    async addBanner(req: Request, res: Response) {
        return await bannerSvc.addBanner(req, res);
    }

    async deleteBanner(req: Request, res: Response) {
        return await bannerSvc.deleteBanner(req, res);
    }

    async getSingleBanner(req: Request, res: Response) {
        return await bannerSvc.getSingleBanner(req, res);
    }
}

export default Banners;