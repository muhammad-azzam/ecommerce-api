import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import categoryFileUpload from "../config/categoryUpload.js";

//@desc Create new Category
//@route POST /api/v1/categories
//@access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category telah ada");
  }
  //create category
  const category = await Category.create({
    name,
    user: req.userAuthId,
    image: req.file?.path,
  });
  res.json({
    status: "success",
    message: "Category telah ditambahkan",
    category,
  });
});

//@desc Get All Category
//@route GET /api/v1/categories
//@access Public
export const getCategoriesCtrl = asyncHandler(async (req, res) => {
  // //query
  // let categoryQuery = Category.find();
  // //search product by name
  // if (req.query.name) {
  //   categoryQuery = categoryQuery.find({
  //     name: { $regex: req.query.name, $options: "i" },
  //   });
  // }

  // //pagination
  // //page
  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // //limit
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
  // //startIdx
  // const startIndex = (page - 1) * limit;
  // //endIdx
  // const endIndex = page * limit;
  // //total
  // const total = await Category.countDocuments();
  // categoryQuery = categoryQuery.skip(startIndex).limit(limit);

  // //pagination result
  // const pagination = {};
  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }
  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  //await categories
  const categories = await Category.find();

  res.json({
    status: "success",
    message: "Categories fecthed successfully",
    categories,
  });
});

//@desc Get Single Categori
//@route GET /api/v1/categories/:id
//@access Public

export const getCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new Error("Category Product ditidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Categoriy fecthed successfully",
    category,
  });
});

//@desc Update Category
//@route PUT /api/v1/categories/:id/update
//@access Private/Admnin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );

  if (!category) {
    throw new Error("Category tidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Category telah diupdate",
    category,
  });
});

//@desc Delete Category
//@route DELETE /api/v1/categories/:id/delete
//@access Private/Admnin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category telah dihapus",
  });
});
