var config = require('../config')();
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.collection('test').find({}, function(err, docs) {
	  	console.log('db accessed');
	});
    res.render('index', { title: 'Express 222' });
	//next();
});

module.exports = router;
