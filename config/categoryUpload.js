import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
  cloud_name: "dp3iuhrq7",
  api_key: "358138931499841",
  api_secret: "JGnSZb1jOb2Psg5o0ly806DaM70",
  secure: true,
});
//create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "Ecommerce-api",
  },
});

//Init multer with storage engine
const categoryFileUpload = multer({
  storage: storage,
});

export default categoryFileUpload;
