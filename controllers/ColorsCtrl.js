import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

//@desc Create new Color
//@route POST /api/v1/colors
//@access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("Color telah ada");
  }
  //create category
  const color = await Color.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "Warna telah ditambahkan",
    color,
  });
});

//@desc Get All Color
//@route GET /api/v1/colors
//@access Public
export const getColorsCtrl = asyncHandler(async (req, res) => {
  // //query
  // let colorQuery = Color.find();
  // //search color by name
  // if (req.query.name) {
  //   colorQuery = colorQuery.find({
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
  // const total = await Color.countDocuments();
  // colorQuery = colorQuery.skip(startIndex).limit(limit);

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
  //const colors = await brandQuery;
  const colors = await Color.find();

  res.json({
    status: "success",
    message: "colors fecthed successfully",
    colors,
  });
});

//@desc Get Single Color
//@route GET /api/v1/colors/:id
//@access Public

export const getColorCtrl = asyncHandler(async (req, res) => {
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

//@desc Update Color
//@route PUT /api/v1/colors/:id/update
//@access Private/Admnin

export const updateColorCtrl = asyncHandler(async (req, res) => {
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

//@desc Delete Color
//@route DELETE /api/v1/colors/:id/delete
//@access Private/Admnin

export const deleteColorCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Brand telah dihapus",
  });
});
