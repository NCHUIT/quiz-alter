var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/:room_code", function(req, res, next){
	res.render("room",  { title: req.params["room_code"] });
});

module.exports = router;
