const mongoose = require('mongoose')
const tripSchema = new mongoose.Schema({


    tripStyle : {
      type : String,
      required : true
    },
    numberOfPeople : {
      type : Number,
      required : true
    },
    startDate : {
        type : String,
        required : true
      },
    duration : {
      type : String,
      required : true
    },
    destination : {
      type : String,
      required : true
    },
                             
}, 
{timestamps : true}
)

const Trip = mongoose.model('Trip', tripSchema)
module.exports = Trip
