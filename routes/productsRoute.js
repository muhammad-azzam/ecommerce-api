import exppress from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/ProductsCtrl.js";
import upload from "../config/fileUpload.js";

const productsRoute = exppress.Router();

productsRoute.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProductCtrl
);
productsRoute.get("/", getProductsCtrl);
productsRoute.get("/:id", getProductCtrl);
productsRoute.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRoute.delete("/:id", isLoggedIn, deleteProductCtrl);

export default productsRoute;
