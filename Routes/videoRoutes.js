const express = require("express");
const videoController = require("./../controllers/videoController");

const router = new express.Router();
// router.param('id', productController.checkId);




router
  .route("/")
  .post( videoController.uploadProductPhoto, videoController.resizeProductImage, videoController.addNewVideo)
  .get(videoController.getVideosPaginated)

router
  .route("/:id")
  .get(videoController.getSingleVideo)
  .patch(videoController.updateVideo)
  .delete(
    
    videoController.deleteVideo
  );

module.exports = router;