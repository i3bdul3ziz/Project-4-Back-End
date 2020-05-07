const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({


    companyName : {
      type : String,
      unique : true,
      required : true
    },
    licensesNumber : {
      type : String,
      unique : true,
      required : true
    },
    companyPhoneNumber : {
        type : String,
        unique: true,
        required : true
      },
    companyEmail : {
      type : String,
      unique: true,
      required : true
    },
    password : {
      type : String,
      required : true
    },
    resetPasswordExpires: Date,
    resetPasswordToken: String,
    trips : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
      }],
    isReg : false
                             
}, 
{timestamps : true}
)

const Company = mongoose.model('Company', companySchema)
module.exports = Company
