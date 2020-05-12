const express = require("express");
const router = express.Router();
const Trip = require("../models/trip.model");
const User = require("../models/user.model");
const Company = require("../models/company.model");
const isLoggedIn = require("../config/config");

// Routes

router.get("/", isLoggedIn, async (req, res) => {
  try {
    let company = await (await Company.findById(req.user._id)).populate("Trip");
    return res.json(company).status(200);
  } catch (error) {
    return res.json({ message: "no trip" }).status(400);
  }
});

router.post("/create", isLoggedIn, (req, res) => {
    const newTrip = {
    tripStyle: req.body.tripStyle,
    numberOfPeople: req.body.numberOfPeople,
    startDate: req.body.startDate,
    duration: req.body.duration,
    destination: req.body.destination,
    lat: req.body.lat,
    lng: req.body.lng,
    tripImages: req.body.tripImages,
    description: req.body.description,
  };
  let trip = new Trip(newTrip);
  trip
    .save()
    .then(() => {
  
      Company.findById(req.user._id, (err, company) => {
        company.trips.push(trip);
        company.save();
      });
      res.json({
        msg: "Your Trip has been created successfully!",
        TripInf: newTrip,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id).populate("User");
    return res.json({ trip }).status(200);
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
    description: req.body.description,
  };
  Trip.findByIdAndUpdate(
    req.params.id,
    { $set: newTrip2 },
    {
      new: true,
    }
  )
    .then((trip) => {
      res.json({ edit: trip });
    })
    .catch((err) => {
      res.status(400).json({ message: "Update is not available" });
    });
});

router.delete("/:id/delete", isLoggedIn, async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);

    res.json({ message: "Your Trip has been deleted successfully!" }).status(200);
  } catch (err) {
    res.json({ message: "Unable to delete" }).status(400);
  }
});

// trips for regular user
router.put("/:id/book", isLoggedIn, (req, res) => {
      User.findByIdAndUpdate(req.user._id, {$push : {booked : req.params.id}})
      .then((user) => {
        res.json({ msg: "Your Trip has been booked successfully!" });
      })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/:id/cancel", isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.user._id)
    .then((user) => {
      var index = user.booked.indexOf(req.params.id);
      if (index !== -1) user.booked.splice(index, 1);
      user.save();
      res.json({ msg: "Trip Canceled successfully!" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
