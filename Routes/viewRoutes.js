const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewController')

router.get('/videos', viewsController.videoPage);
