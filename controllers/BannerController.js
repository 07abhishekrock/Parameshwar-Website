const express = require("express");
const validator = require("validator");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const Banner = require("./../models/BannerModel");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/productImage')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `-product-Img${req.user._id}-${Date.now()}.${ext}`)
//   }
// })

// comment started parmeshwar
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image! Please Upload only Image ", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductPhoto = upload.single("photo")

exports.resizeProductImage = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `-banner-Img-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(600, 580)
    .toFormat("jpeg")
    .jpeg({
      quality: 90
    })
    .toFile(`./public/img/${req.file.filename}`);
  next()
};

exports.getAllBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.find();
  if (!banner) {
    return next(new AppError("No product found with this ID"));
  }
  res.status(200).json({
    status: "success",
    result: banner.length,
    data: banner,
  });
});

exports.getSingleBanner = catchAsync(async (req, res, next) => {
  const singleBanner = await Banner.findById(req.params.id);

  if (!singleBanner) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
		 singleBanner
    },
  });
});

exports.addNewBanner = catchAsync(async (req, res, next) => {
  const newBanner = await Banner.create({
    title: req.body.title,
    photo: req.file.filename,

  });
//  console.log(photo.length);
  res.status(201).json({
    status: "success",
    data: {
		 banner : newBanner
    },
  });
});

exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return next(new AppError("No Banner found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});