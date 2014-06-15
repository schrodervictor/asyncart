var config = require('../config')();
var express = require('express');
var router = express.Router();
var ContentController = require('../controller/ContentController.class');

/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.collection('test').find({}, function(err, docs) {
	  	console.log('db accessed');
	});
    res.render('index', { title: 'Express 222' });
	//next();
});

router.get('/teste', function(req, res, next) {
	content = new ContentController();
	content.run(req, res, next);
});

module.exports = router;
