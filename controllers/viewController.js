const Video = require("./../models/videoModel");

const axios = require("axios");

exports.videoPage= async (req, res, next) => {
    
    const videos = await Video.find();
    res.render("videopage", {
     videos
  
  
    });
  };
  
  exports.singleVideo= async(req, res, next) => {
    
    const videos = await  Video.findOne({
      id:req.params.id
    }); 
   console.log(videos);
    res.render("singleVideo", {
      videos
     });
  };

