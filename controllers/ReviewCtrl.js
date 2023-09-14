import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";
// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;

  //1. Find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product tidak ditemukan");
  }
  //check if user already reviewed this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("Anda telah mereview untuk product ini");
  }
  //craete review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });
  //push review into product
  productFound.reviews.push(review?._id);
  await productFound.save();
  res.status(201).json({
    status: "success",
    message: "Review berhasil ditambahkan",
  });
});
