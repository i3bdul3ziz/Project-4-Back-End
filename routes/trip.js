const express = require('express');
const router = express.Router();
const Trip = require("../models/trip.model")
const isLoggedIn = require("../config/config");



// Routes
router.post("/book", isLoggedIn, (req, res) => {
  const newTrip = {
    tripStyle: req.body.tripStyle,
    numberOfPeople: req.body.numberOfPeople,
    startDate: req.user.startDate,
    duration: req.body.duration,
    destination: req.body.destination,
  };
  let trip = new Trip(newTrip);
  trip
    .save()
    .then(() => {
      console.log("good!");
      User.findById(req.user._id, (err, user) => {
        user.trips.push(trip);
        user.save();
      });
      res.json({ msg: "Your Trip has been booked successfully!", TripInf: newTrip });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id",isLoggedIn ,async (req, res) => {
      
  try {
    let trip = await Trip.findById(req.params.id)
    
    return res.json({ trip }).status(200);
  } catch (error) {
    return res.json({ message: "No Trip" }).status(400);
  }
});

router.put("/:id/edit", (req, res) => {
  let newTrip2 = {
    tripStyle: req.body.tripStyle,
    numberOfPeople: req.body.numberOfPeople,
    startDate: req.user.startDate,
    duration: req.body.duration,
    destination: req.body.destination,
  }
  Trip.findByIdAndUpdate(req.params.id,{$set:newTrip2} ,{
    new : true
  })  
  .then(trip => {
    res.json({edit :trip });
  })
  .catch(err => {
    res.status(400).json({messge: "Update is not available"})
  })
});

router.delete("/:id/delete",isLoggedIn,async(req, res) => { 

 
 try {
  await Trip.findByIdAndDelete(req.params.id)

  res.json({ message: "Trip Canceled successfully!" }).status(200);
} catch (err) {
  res.json({ message: "Unable to cancel" }).status(400);
}
})
  // Item.findByIdAndDelete(req.params.id)
  // .then(()=>{
  //   res.status(200).json({message: "deleted"})
  // })
  // .catch(err => {
  //   console.log(err)
  //   res.status(400).json({message: "somthing went wrong"})
  // })


module.exports = router;
