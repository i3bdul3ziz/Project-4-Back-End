const express = require("express");
const router = express.Router();
const Company = require("../models/company.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const isLoggedIn = require("../config/config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

// company/
router.post("/signup", (req, res) => {
  const newCompany = {
    companyName: req.body.companyName,
    licensesNumber: req.body.licensesNumber,
    companyPhoneNumber: req.body.companyPhoneNumber,
    companyEmail: req.body.companyEmail,
    password: req.body.password,
  };
  // res.send(newCompany)
  Company.findOne({ companyEmail: newCompany.companyEmail })
    .then((company) => {
      // if email not incloads the database
      if (!company) {
        bcrypt.hash(newCompany.password, 10, (err, hash) => {
          newCompany.password = hash;
          Company.create(newCompany).then(() =>
            res.json({ msg: "company created", companyInf: newCompany, signup: true })
          );
        });
      } else {
        //if email have been used
        res.json({ msg: "email used", signup: false });
      }
    })
    .catch((err) => res.json(err));
});

router.post("/signin", (req, res) => {
  const signinCompany = {
    companyEmail: req.body.companyEmail,
    password: req.body.password,
  };

  Company.findOne({ companyEmail: signinCompany.companyEmail })
    .then((company) => {
      //if email exist
      if (company) {
        // if password is correct
        if (bcrypt.compareSync(signinCompany.password, company.password)) {
          let payload = { company };
          let token = jwt.sign(payload, "SECRET", { expiresIn: 36000000 });
          res.json({ token, signin: true });
          // if password is not correct
        } else {
          res.json({ msg: "password is not correct" });
        }
        //if email not exist
      } else {
        res.json({ msg: "email is not found" });
      }
    })
    .catch((err) => res.json(err));
});

// FORGET PASSWORD
router.post("/forgetPass", (req, res) => {
  Company.findOne({ companyEmail: req.body.companyEmail }).then((company) => {
    if (!company) return res.json({ msg: "Email doesn't Exist." });
    company.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    company.resetPasswordExpires = Date.now() + 36000000;
    company.save().then((company) => {
      const msg = {
        to: company.companyEmail,
        from: "experiment.yourself1@gmail.com",
        subject: "Reset Password",
        text: " ",
        html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n 
        Please click on the following link, or paste this into your browser to complete the process:\n\n +
        http://localhost:3000/reset/${company.resetPasswordToken}
        \n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
        `,
      };
      sgMail
        .send(msg)
        .then(() => res.json({ msg: "Sending Email: Success." }))
        .catch((err) => res.json({ msg: err }));
    });
  });
});

router.post("/reset/:token", (req, res) => {
  console.log(req.body.password);

  Company.findOne({ resetPasswordToken: req.params.token }).then((company) => {
    if (!company) return res.json({ msg: "Company token doesn't Exist." });
    company.resetPasswordToken = undefined;
    company.resetPasswordExpires = undefined;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      company.password = hash;
      company.save().then(() => res.json({ msg: "Password Changed." }));
    });
  });
});

router.get("/:id",isLoggedIn ,async (req, res) => {
      
    try {
      let company = await Company.findById(req.params.id)
      
      return res.json({ company }).status(200);
    } catch (error) {
      return res.json({ message: "Error!! Go go go!!!!!" }).status(400);
    }
});


module.exports = router;