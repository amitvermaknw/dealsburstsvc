import { Request, Response } from "express";
import SubscriberServices from "../../services/db/subscriberService";

const subscriberSvc = new SubscriberServices();

class Subscriber {
    async addSubscriber(req: Request, res: Response) {
        return await subscriberSvc.addSub(req, res);
    }
}

export default Subscriber;