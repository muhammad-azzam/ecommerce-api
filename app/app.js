import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import express from "express";
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import userRoutes from "../routes/usersRoute.js";
import productsRoute from "../routes/productsRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import reviewsRouter from "../routes/reviewsRouter.js";
import orderRouter from "../routes/orderRoute.js";
import couponsRouter from "../routes/couponRouter.js";

//db connection
dbConnect();
const app = express();
//cors
app.use(cors());
//pass incoming data
app.use(express.json());

//request
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/colors", colorsRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
