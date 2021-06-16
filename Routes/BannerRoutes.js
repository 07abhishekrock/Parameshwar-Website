const express = require("express");
const Banner = require("../models/BannerModel");
const BannerController = require("./../controllers/BannerController");

const router = new express.Router();
// router.param('id', productController.checkId);




router
  .route("/")
  .get(BannerController.getAllBanner)
  .post( BannerController.uploadProductPhoto, BannerController.resizeProductImage, BannerController.addNewBanner);

router
  .route("/:id")
  .get(BannerController.getSingleBanner)
  .delete(BannerController.deleteBanner);

module.exports = router;