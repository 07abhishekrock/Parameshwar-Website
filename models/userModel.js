const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    default:"surender@321"
  },

  password: {
    type: String,
  },

  username:{
    type: String,
  },

  role:{
	  type: String,
	  default: 'admin'
  },

  phoneNo:{
	  type:String,
  },

  email:{
	  type:String,
  }
  
});

// productSchema.pre("save", function () {
//   console.log(this);
// });

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

UserSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changePasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
		console.log(changedTimeStamp, JWTTimestamp);
		return JWTTimestamp < changedTimeStamp;
	}

	return false;
};

UserSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

// Product.createIndexes();

const AdminUser = mongoose.model("AdminUser", UserSchema);
module.exports = AdminUser;