
import express, { Router } from "express";
import Banners from "./scripts/controllers/db/banners";
import Deals from "./scripts/controllers/db/deals";
import Login from "./scripts/controllers/db/login";
import Subscriber from "./scripts/controllers/db/subscriber";

const router: Router = express.Router();
const banner = new Banners;
const deals = new Deals;
const login = new Login;
const subscriber = new Subscriber;


router.post("/db/login", login.login);
//Admin token
router.post("/db/admintoken", login.addAdminLogToken);
router.put("/db/admintoken", login.updateAdminTokenLog);
router.get("/db/tokenvalidation", login.tokenValidation);

//Banner
router.get("/db/banner/:state/:page", banner.getBanner);
router.get("/db/banner/details/:bid", banner.getBanner);
router.delete("/db/banner", login.validateToken, banner.deleteBanner);
router.get("/db/banner/:bid", login.validateToken, banner.getSingleBanner);
router.post("/db/banner", login.validateToken, banner.addBanner);
router.put("/db/banner", login.validateToken, banner.updateBanner);

//Deals
router.get("/db/deals/:state/:page", deals.getDeals);
router.get("/db/deals/product/details/:pid", deals.getDealDetails);
router.get("/db/deals/categories", deals.getDealsCategory);
router.get("/db/deals/:pid", deals.getSingleDeals);
router.get("/db/deals/yml/pd/:category", deals.getDealsOnCategory);
router.delete("/db/deals", login.validateToken, deals.deleteDeals);
router.post("/db/deals", login.validateToken, deals.addDeals);
router.put("/db/deals", login.validateToken, deals.updateDeals);

//Subscribe
router.post("/db/subscribe", subscriber.addSubscriber);



export default router;