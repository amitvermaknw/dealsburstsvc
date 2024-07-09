import { Request, Response } from "express";
import DealsServices from "../../services/db/dealsService";

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
        return await dealsSvc.addDeals(req, res);
    }

    async updateDeals(req: Request, res: Response) {
        return await dealsSvc.updateDeals(req, res);
    }
}

export default Deals;