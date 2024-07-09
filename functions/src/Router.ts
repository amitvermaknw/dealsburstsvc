
import express, { Router } from "express";
import TodaysDeal from "./scripts/controllers/db/todaysDeal";
import Banners from "./scripts/controllers/db/banners";
import Deals from "./scripts/controllers/db/deals";

const router: Router = express.Router();
const todaysDals = new TodaysDeal;
const banner = new Banners;
const deals = new Deals;


router.get("/db/banner", banner.getBanner);
router.get("/db/banner/details/:bid", banner.getBanner);
router.post("/db/banner", banner.addBanner);
router.delete("/db/banner", banner.deleteBanner);

router.get("/db/deals/:state/:page", deals.getDeals);
router.get("/db/deals/details/:pid", deals.getDealDetails);
router.get("/db/deals/:pid", deals.getSingleDeals);
router.delete("/db/deals", deals.deleteDeals);
router.post("/db/deals", deals.addDeals);
router.put("/db/deals", deals.updateDeals);







export default router;