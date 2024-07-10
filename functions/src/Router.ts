
import express, { Router } from "express";
import Banners from "./scripts/controllers/db/banners";
import Deals from "./scripts/controllers/db/deals";
import Login from "./scripts/controllers/db/login";

const router: Router = express.Router();
const banner = new Banners;
const deals = new Deals;
const login = new Login;


router.post("/db/login", login.login);
router.get("/db/banner", banner.getBanner);
router.get("/db/banner/details/:bid", banner.getBanner);
router.post("/db/banner", login.validateToken, banner.addBanner);
router.delete("/db/banner", login.validateToken, banner.deleteBanner);
router.get("/db/deals/:state/:page", deals.getDeals);
router.get("/db/deals/details/:pid", deals.getDealDetails);
router.get("/db/deals/:pid", deals.getSingleDeals);
router.delete("/db/deals", login.validateToken, deals.deleteDeals);
router.post("/db/deals", login.validateToken, deals.addDeals);
router.put("/db/deals", login.validateToken, deals.updateDeals);


export default router;