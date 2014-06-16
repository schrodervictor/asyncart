var config = require('../config')();
var express = require('express');
var router = express.Router();
var ContentController = require('../controller/ContentController.class');

/* GET home page. */
router.get('/', function(req, res, next) {
	var Home = require('../controller/common/HomeController.class');
	(new Home())['index'](req, res, next);
});

router.get('/teste', function(req, res, next) {
	content = new ContentController();
	content.run(req, res, next);
});

module.exports = router;
