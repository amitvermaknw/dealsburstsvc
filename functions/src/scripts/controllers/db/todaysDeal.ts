import { Request, Response } from "express";
import BannerServices from '../../services/db/bannerService';

const bannerSvc = new BannerServices();

class TodaysDeal {
    async addDeals(req: Request, res: Response) {
        return await bannerSvc.fetchBannerService(req, res);
    }
}

export default TodaysDeal;