var config = require('../config')();
var express = require('express');
var router = express.Router();
var Admin = require('../controller/AdminController');

/* POST Admin Login page */
router.post('/login', function(req, res, next) {
	var admin = new Admin();
	admin.run(req, res, next);
});

/* All Admin Logout */
router.all('/logout', function(req, res, next) {
	var admin = new Admin();
	admin.logout(req, res, next);
});

/* GET Admin page */
router.get('/*', function(req, res, next) {
	var Admin = require('../controller/AdminController');
	var admin = new Admin();
	admin.run(req, res, next);
});

module.exports = router;