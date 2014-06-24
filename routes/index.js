var config = require('../config')();
var express = require('express');
var router = express.Router();

router.param('group', function(req, res, next, group) {
	// TODO implement validation of this entry (for safety)
    req.group = group.toLowerCase();
    console.log('Group: ' + req.group);
    next();
});

router.param('controller', function(req, res, next, controller) {
	// TODO implement validation of this entry (for safety)
	// TODO Add suport for multiple word controller files
    req.controller = controller.charAt(0).toUpperCase() + controller.substr(1).toLowerCase();
    console.log('Controller: ' + req.controller);
    next();
});

router.param('action', function(req, res, next, action) {
	// TODO implement validation of this entry (for safety)
	// TODO Add suport for multiple word methods
   	req.action = action.toLowerCase();
    console.log('Action: ' + req.action);
    next();
});

router.param('category', function(req, res, next, category) {
	// TODO implement validation of this entry (for safety)
    req.categories = category.toLowerCase().split('-');
    console.log('req.categories: ' + req.categories);
    next();
});

/* Forward all requests from / to common/home */
router.all('/', function(req, res, next) {
	var Controller = require('../engine/Controller.class');
	new Controller().forward(req, res, next, 'common/home');
});

/* GET category/999-888-777/product/999 */
router.get('/category/:category/product/:product', function(req, res, next) {

	var Page = require('../controller/catalog/ProductController.class');
	var page = new Page(req, res, next);
	if(page.isExposedAction(req.action || 'index')) {
		page[req.action || 'index']();
	} else {
		next();
	}
});

/* GET home page. */
router.get('/:group/:controller/:action?', function(req, res, next) {
	var Page = require('../controller/' + req.group + '/' + req.controller + 'Controller.class');
	var page = new Page(req, res, next);
	if(page.isExposedAction(req.action || 'index')) {
		page[req.action || 'index']();
	} else {
		next();
	}
});

module.exports = router;
