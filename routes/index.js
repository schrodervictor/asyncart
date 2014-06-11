var config = require('../config')();
var express = require('express');
var router = express.Router();
var Admin = require('../controller/AdminController');



/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.collection('test').find({}, function(err, docs) {
	  	console.log('db accessed');
	});
    res.render('index', { title: 'Express 222' });
	//next();
});

/* POST Admin Login page */
router.post('/admin/login', function(req, res, next) {
	var admin = new Admin();
	admin.run(req, res, next);
});

/* All Admin Logout */
router.all('/admin/logout', function(req, res, next) {
	var admin = new Admin();
	admin.logout(req, res, next);
});

/* GET Admin page */
router.get('/admin*', function(req, res, next) {
	var Admin = require('../controller/AdminController');
	var admin = new Admin();
	admin.run(req, res, next);
});

module.exports = router;
