var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
// var userRoute = require('routes/user.js')


// Mongodb Connection
const PORT = process.env.PORT||4000
mongoose
  .connect(
    "mongodb://localhost/TTG",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then((res) => console.log("mongodb is connected"))
  .catch((err) => console.log(err));


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Starter Routes
app.use("/user", require("./routes/user.js"));
app.use("/trip", require("./routes/trip.js"));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(PORT, () => console.log("server run on 4000"));

module.exports = app;
