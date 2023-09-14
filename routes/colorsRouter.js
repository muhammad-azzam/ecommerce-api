import express from "express";
import {
  createColorCtrl,
  getColorsCtrl,
  getColorCtrl,
  updateColorCtrl,
  deleteColorCtrl,
} from "../controllers/ColorsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const colorsRouter = express.Router();
colorsRouter.post("/", isLoggedIn, createColorCtrl);
colorsRouter.get("/", getColorsCtrl);
colorsRouter.get("/:id", getColorCtrl);
colorsRouter.put("/:id", updateColorCtrl);
colorsRouter.delete("/:id", deleteColorCtrl);

export default colorsRouter;
