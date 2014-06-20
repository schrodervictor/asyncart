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

/* Forward all requests from / to common/home */
router.all('/', function(req, res, next) {
	var Controller = require('../engine/Controller.class');
	new Controller().forward(req, res, next, 'common/home');
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
