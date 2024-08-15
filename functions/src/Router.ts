
import express, { Router } from "express";
import Banners from "./scripts/controllers/db/banners";
import Deals from "./scripts/controllers/db/deals";
import AdminLogin from "./scripts/controllers/db/adminLogin";
import Subscriber from "./scripts/controllers/db/subscriber";
import UserLogin from "./scripts/controllers/db/userLogin";

const router: Router = express.Router();
const banner = new Banners;
const deals = new Deals;
const adminLogin = new AdminLogin;
const subscriber = new Subscriber;
const userLogin = new UserLogin;


router.post("/db/login", adminLogin.login);
//Admin token
router.post("/db/admintoken", adminLogin.addAdminLogToken);
router.put("/db/admintoken", adminLogin.updateAdminTokenLog);
router.get("/db/tokenvalidation", adminLogin.tokenValidation);

//Banner
router.get("/db/banner/:state/:page", banner.getBanner);
router.get("/db/banner/details/:bid", banner.getBanner);
router.delete("/db/banner", adminLogin.validateToken, banner.deleteBanner);
router.get("/db/banner/:bid", adminLogin.validateToken, banner.getSingleBanner);
router.post("/db/banner", adminLogin.validateToken, banner.addBanner);
router.put("/db/banner", adminLogin.validateToken, banner.updateBanner);

//Deals
router.get("/db/deals/:state/:page", deals.getDeals);
router.get("/db/deals/product/details/:pid", deals.getDealDetails);
router.get("/db/deals/categories", deals.getDealsCategory);
router.get("/db/deals/:pid", deals.getSingleDeals);
router.get("/db/deals/yml/pd/:category", deals.getDealsOnCategory);
router.delete("/db/deals", adminLogin.validateToken, deals.deleteDeals);
router.post("/db/deals", adminLogin.validateToken, deals.addDeals);
router.put("/db/deals", adminLogin.validateToken, deals.updateDeals);

//Subscribe
router.post("/db/subscribe", subscriber.addSubscriber);

//Userlogin
router.post("/db/user/login", userLogin.login);
router.get("/db/auth/validate", userLogin.tokenValidation);
router.post("/db/users/signup", userLogin.userSignup);



export default router;