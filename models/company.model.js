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
    comoanyPhoneNumber : {
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
    trips : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
      }],
                             
}, 
{timestamps : true}
)

const Company = mongoose.model('Company', companySchema)
module.exports = Company
