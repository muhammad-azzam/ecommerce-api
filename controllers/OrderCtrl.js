import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

//@desc create orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get the coupon
  const { coupon } = req.query;
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });
  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }
  if (!couponFound) {
    throw new Error("Coupon tidak ditemukan");
  }
  //get discount
  const discount = couponFound?.discount / 100;

  //get the payload(customer, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //find the user
  const user = await User.findById(req.userAuthId);
  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order items");
  }
  //Place/create order- save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);

  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment (stripe)
  //payment webhook
  //update the user order
  res.json({
    success: true,
    message: "Order telah dibuat",
    order,
    user,
  });
});

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
