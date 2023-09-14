import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

//@desc Create new Product
//@route POST /api/v1/products
//@access Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  const convertedImgs = req.files.map((file) => file.path);
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;
  //Product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product sudah ada");
  }
  //find category
  const brandFound = await Brand.findOne({
    name: brand,
  });
  if (!brandFound) {
    throw new Error(
      "Brand tidak ditemukan, silahkan cek kembali brand tersebut"
    );
  }
  //find category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error("Category tidak ditemukan, silahkan buat Categorynya");
  }
  //create product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });
  //push the product into category
  categoryFound.products.push(product._id);
  //resave
  await categoryFound.save();
  //push the product into brand
  brandFound.products.push(product._id);
  //resave
  await brandFound.save();
  //send response
  res.status(201).json({
    status: "success",
    message: "Product berhasil ditambahkan",
    product,
  });
});

//@desc Get all Product
//@route GET /api/v1/products
//@access Public

export const getProductsCtrl = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find();
  //search product by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //search product by name
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //search product by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //search product by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  //search product by sizes
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  //search product by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less then or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();
  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await query
  const products = await productQuery.populate("reviews");

  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fecthed successfully",
    products,
  });
});

//@desc Get Single Product
//@route GET /api/v1/products/:id
//@access Public

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product ditidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Product ",
    product,
  });
});

//@desc Update Product
//@route PUT /api/v1/products/:id/update
//@access Private/Admnin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
    }
  );

  if (!product) {
    throw new Error("Product tidak ditemukan");
  }
  res.json({
    status: "success",
    message: "Product telah diupdate",
    product,
  });
});

//@desc Delete Product
//@route DELETE /api/v1/products/:id/delete
//@access Private/Admnin

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product telah dihapus",
  });
});
