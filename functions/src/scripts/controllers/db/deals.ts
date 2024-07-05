import { Request, Response } from "express";
import DealsServices from "../../services/db/dealsService";

const dealsSvc = new DealsServices();

class Deals {
    async getDeals(req: Request, res: Response) {
        return await dealsSvc.getDeals(req, res);
    }
}

export default Deals;