import express from "express";
import { createReviewCtrl } from "../controllers/ReviewCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewsRouter = express.Router();
reviewsRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewsRouter;
