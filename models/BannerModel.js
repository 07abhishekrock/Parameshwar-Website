const mongoose = require("mongoose");
const validator = require("validator");

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  photo: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// productSchema.pre("save", function () {
//   console.log(this);
// });

const Banner = mongoose.model("Banner", BannerSchema);
// Product.createIndexes();

module.exports = Banner;