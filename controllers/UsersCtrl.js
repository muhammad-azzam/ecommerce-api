import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

//@desc Register user
//@route POST /api/v1/users/register
//@access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  //Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User sudah ada");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User Register berhasil ditambahkan",
    data: user,
  });
});

//@desc Login user
//@route POST /api/v1/users/login
//@access Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user in db by Email only
  const userFound = await User.findOne({ email });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "Login berhasil",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credential");
  }
});

//@desc Get user profil
//@route GET /api/v1/users/profile
//@access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify token
  const verified = verifyToken(token);

  console.log(req);
  res.json({
    msg: "Welcome Profile page",
  });
});

// @desc    Update user shipping address
// @route   PUT /api/v1/users/update/shipping
// @access  Private
export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  //send response
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});
