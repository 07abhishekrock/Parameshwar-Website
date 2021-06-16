const mongoose = require("mongoose");
const validator = require("validator");

const UserCountSchema = new mongoose.Schema({
  totalCount : {
		type:Number,
		default:0		
  },
  currentMonth : {
	  type:Number,
	  default:(new Date()).getMonth()
  },
  currentYear : {
	  type:Number,
	  default:(new Date()).getYear()
  },
  countCurrentMonth : {
	  type:Number,
	  default:0
  },
  countCurrentYear : {
	  type:Number,
	  default:0
  }
});

// productSchema.pre("save", function () {
//   console.log(this);
// });

const UserCount = mongoose.model("UserCount", UserCountSchema);
// Product.createIndexes();

module.exports = UserCount