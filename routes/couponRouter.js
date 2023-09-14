import exppress from "express";
import {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} from "../controllers/CouponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponsRouter = exppress.Router();

couponsRouter.post("/", isLoggedIn, createCouponCtrl);
couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.get("/:id", getCouponCtrl);
couponsRouter.put("/update/:id", isLoggedIn, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, deleteCouponCtrl);

export default couponsRouter;
