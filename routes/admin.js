var config = require('../config')();
var express = require('express');
var router = express.Router();
var Admin = require('../controller/admin/AdminController.class');

/* All Admin Login page */
router.all('/login', function(req, res, next) {
	var admin = new Admin();
	admin.login(req, res, next);
});

/* All Admin Logout */
router.all('/logout', function(req, res, next) {
	var admin = new Admin();
	admin.logout(req, res, next);
});

/* GET Admin page */
router.get('/*', function(req, res, next) {
	var admin = new Admin();
	var model = admin.getModel(req);
	console.log(model);
	admin.run(req, res, next);
});

module.exports = router;