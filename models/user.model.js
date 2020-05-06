const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({


    firstName : {
      type : String,
      required : true
    },
    lastName : {
      type : String,
      required : true
    },
    phoneNumber : {
        type : String,
        unique: true,
        required : true
      },
    email : {
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

const User = mongoose.model('User', userSchema)
module.exports = User
