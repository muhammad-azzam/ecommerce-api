import express from "express";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/CategoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryFileUpload from "../config/categoryUpload.js";

const categoriesRouter = express.Router();
categoriesRouter.post(
  "/",
  isLoggedIn,
  categoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:id", getCategoryCtrl);
categoriesRouter.put("/:id", updateCategoryCtrl);
categoriesRouter.delete("/:id", deleteCategoryCtrl);

export default categoriesRouter;
