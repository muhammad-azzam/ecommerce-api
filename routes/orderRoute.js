import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getOrderStatsCtrl,
} from "../controllers/OrderCtrl.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);

export default orderRouter;
