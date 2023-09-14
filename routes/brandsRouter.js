import express from "express";
import {
  createBrandCtrl,
  getBrandsCtrl,
  getBrandCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
} from "../controllers/BrandsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const brandsRouter = express.Router();
brandsRouter.post("/", isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getBrandsCtrl);
brandsRouter.get("/:id", getBrandCtrl);
brandsRouter.put("/:id", updateBrandCtrl);
brandsRouter.delete("/:id", deleteBrandCtrl);

export default brandsRouter;
