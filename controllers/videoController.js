const express = require("express");
const Video = require("./../models/videoModel");
const validator = require("validator");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");

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
  req.file.filename = `-product-Img-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(600, 580)
    .toFormat("jpeg")
    .jpeg({
      quality: 90
    })
    .toFile(`./public/img/${req.file.filename}`);
  next()
};

exports.getAllVideo = catchAsync(async (req, res, next) => {
  const video = await Video.find();
  if (!video) {
    return next(new AppError("No product found with this ID"));
  }
  res.status(200).json({
    status: "success",
    result: video.length,
    data: {
      video,
    },
  });
});

const categories = ['Bhakti' , 'Bhajan' , 'Arti' , 'Live'];
exports.getVideosPaginated = catchAsync(async (req , res, next)=>{
  const category = categories[req.query.category] || 'Bhakti';
  const skip = req.query.pageIndex ? Number(req.query.pageIndex) * 5 : 0;
  const videos = await Video.find({category:category}).skip(skip).limit(5);
  console.log(videos);
  if(!videos.length){
    return res.status(200).json({
      status:'failure',
      error:'No more Videos Found'
    })
  }
  else{
    res.status(200).json({
      status:"success",
      result:videos.length,
      data:videos
    })
  }
})

exports.getSingleVideo = catchAsync(async (req, res, next) => {
  const singleVideo = await Video.findById(req.params.id);

  if (!singleVideo) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
        singleVideo,
    },
  });
});



exports.addNewVideo = catchAsync(async (req, res, next) => {
  const newVideo = await Video.create({
    name: req.body.name,
    category: categories[req.body.category],
    subcategory: req.body.subcategory,
    codeSnippet: req.body.codeSnippet,
    description: req.body.description,
    approvedBy: req.body.approvedBy,
    enableDisplay: req.body.enableDisplay,
    snippet:req.body.snippet,
    photo: req.file.filename,
  });
//  console.log(photo.length);
  res.status(201).json({
    status: "success",
    data: {
      video: newVideo,
    },
  });
});

exports.updateVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // runValidators: true,
  });

  if (!video) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      video,
    },
  });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) {
    return next(new AppError("No product found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});