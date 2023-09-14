import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

//@desc Create new Brand
//@route POST /api/v1/brands
//@access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand telah ada");
  }
  //create category
  const brand = await Brand.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "Brand telah ditambahkan",
    brand,
  });
});

//@desc Get All Brand
//@route GET /api/v1/brands
//@access Public
export const getBrandsCtrl = asyncHandler(async (req, res) => {
  // //query
  // let brandQuery = Brand.find();
  // //search brand by name
  // if (req.query.name) {
  //   brandQuery = brandQuery.find({
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
  // const total = await Brand.countDocuments();
  // brandQuery = brandQuery.skip(startIndex).limit(limit);

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

  //await query
  const brands = await Brand.find();

  res.json({
    status: "success",
    message: "Brands fecthed successfully",
    brands,
  });
});

//@desc Get Single Brand
//@route GET /api/v1/brands/:id
//@access Public

export const getBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand tidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Brand fecthed successfully",
    brand,
  });
});

//@desc Update Brand
//@route PUT /api/v1/brands/:id/update
//@access Private/Admnin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );

  if (!brand) {
    throw new Error("Brand tidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Brand telah diupdate",
    brand,
  });
});

//@desc Delete Brand
//@route DELETE /api/v1/brands/:id/delete
//@access Private/Admnin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Brand telah dihapus",
  });
});
