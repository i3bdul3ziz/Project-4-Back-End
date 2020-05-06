var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Trip Page', { title: 'Express' });
});

module.exports = router;
