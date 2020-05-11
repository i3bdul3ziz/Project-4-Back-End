const express = require('express');
const router = express.Router();
const Trip = require("../models/trip.model")
const User = require("../models/user.model")
const Company = require("../models/company.model")
const isLoggedIn = require("../config/config");



// Routes
router.post("/create", isLoggedIn,(req, res) => {
  const newTrip = {
    tripStyle: req.body.tripStyle,
    numberOfPeople: req.body.numberOfPeople,
    startDate: req.body.startDate,
    duration: req.body.duration,
    destination: req.body.destination,
    lat: req.body.lat,
    lng : req.body.lng,
    tripImages: req.body.image,
    description : req.body.description
  };
  let trip = new Trip(newTrip);
  trip
    .save()
    .then(() => {
      console.log("good!");
      Company.findById(req.user._id, (err, company) => {
        company.trips.push(trip);
        company.save();
      });
      res.json({ msg: "Your Trip has been booked successfully!", TripInf: newTrip });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id",isLoggedIn ,async (req, res) => {
      
  try {
    let trip = await Trip.findById(req.params.id).populate('User')
    return res.json({ trip }).status(200)

  } catch (error) {
    return res.json({ message: "No Trip" }).status(400);
  }
});

router.put("/:id/edit", (req, res) => {
  let newTrip2 = {
    tripStyle: req.body.tripStyle,
    numberOfPeople: req.body.numberOfPeople,
    startDate: req.body.startDate,
    duration: req.body.duration,
    destination: req.body.destination,
    tripImages: req.body.image,
    description : req.body.description
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

// trips for regular user
router.put("/:id/book", isLoggedIn, (req, res) => {
    Trip.findByIdAndUpdate(req.params.id).then(trip => {
      User.findByIdAndUpdate(req.user._id).then(user => {
        user.booked.push(trip);
        user.save();
      });
      trip.user.push(req.user._id);
      trip.save();
      res.json({ msg: "Your Trip has been booked successfully!"});
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/:id/delete", isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(req.user._id).then(user => {
      var index = user.booked.indexOf(req.params.id);
      if (index !== -1) user.booked.splice(index, 1);
      user.save();
      res.json({ msg: "Your Trip has been deleted successfully!"});
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;
