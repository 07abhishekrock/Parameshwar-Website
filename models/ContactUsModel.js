const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default:"surender@321"
    },
    
    phoneNo:{
        type:String,
    },

    email:{
        type:String,
    },

    fatherName:{
        type:String,
    },

    aadharNumber:{
        type:String,
    },

    query:{
        type:String,
    }
    
});

// productSchema.pre("save", function () {
//   console.log(this);
// });

const ContactUs = mongoose.model("ContactUs", ContactSchema);
// Product.createIndexes();

module.exports = ContactUs;