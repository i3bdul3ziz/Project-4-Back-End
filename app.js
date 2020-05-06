const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT||4000

mongoose
  .connect(
    "mongodb://localhost/project",

    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then((res) => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Starter Routes 
app.use("/user", require("./routes/user"));
app.use("/trip", require("./routes/trip"));

app.listen(PORT, () => console.log("server run on 4000"));