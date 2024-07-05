
import express, { Router } from "express";
import TodaysDeal from "./scripts/controllers/db/todaysDeal";
import Banners from "./scripts/controllers/db/banners";
import Deals from "./scripts/controllers/db/deals";

const router: Router = express.Router();
const todaysDals = new TodaysDeal;
const banner = new Banners;
const deals = new Deals;


router.get("/db/getbanner", banner.getBanner);
router.get("/db/getdeals/:state/:page", deals.getDeals);


export default router;