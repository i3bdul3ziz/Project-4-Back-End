const mongoose = require('mongoose')
const tripSchema = new mongoose.Schema({


    tripStyle : {
      type : String,
      required : true
    },
    numberOfPeople : {
      type : String,
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
    lat:{
      type : String,
      required : true
    },
    lng: {
      type : String,
      required : true
    },
    aboutTrip : {
      tripImages : [{
        type : String,
        required : true
      }],
      description : {
        type : String,
        required : true
      }
    },

   
                             
}, 
{timestamps : true}
)

const Trip = mongoose.model('Trip', tripSchema)
module.exports = Trip
