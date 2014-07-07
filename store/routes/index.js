var config = require(__config)();
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
    if(req.group) {
    	req.controllerPath = req.group + '/' + req.controller;
    }
    console.log('Controller: ' + req.controller);
    next();
});

var defaultAction = 'indexAction';

router.param('action', function(req, res, next, action) {
	// TODO implement validation of this entry (for safety)
	// TODO Add suport for multiple word methods
   	req.action = action.toLowerCase() + 'Action';
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
	var controller = req.load.engine('controller');
	controller.forward('common/home');
});

/* GET category/999-888-777/product/999 */
router.get('/category/:category/product/:product', function(req, res, next) {

	var page = req.load.controller('catalog/product');

	if('function' === typeof(page[req.action])) {
		page[req.action]();
	} else if('function' === typeof(page[defaultAction])) {
		page[defaultAction]();
	} else {
		next();
	}
});

/* GET category/999-888-777 */
router.get('/category/:category', function(req, res, next) {

	var page = req.load.controller('catalog/category');

	if('function' === typeof(page[req.action])) {
		page[req.action]();
	} else if('function' === typeof(page[defaultAction])) {
		page[defaultAction]();
	} else {
		next();
	}
});

/* GET home page. */
router.get('/:group/:controller/:action?', function(req, res, next) {
	
	var page = req.load.controller(req.controllerPath);
	
	if('function' === typeof(page[req.action])) {
		page[req.action]();
	} else if('function' === typeof(page[defaultAction])) {
		page[defaultAction]();
	} else {
		next();
	}
});

module.exports = router;
