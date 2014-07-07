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

router.use(function isLogged(req, res, next) {
    req.user = req.load.engine('user');
    req.user.isLogged(function(err, logged) {
        if(err) return next(err);
        if(logged) return next();
        var controller = req.load.engine('controller');
        return controller.forward('admin/login');
    });
});

router.use(function hasPermission(req, res, next) {
    req.user.hasPermission(function(err, permission) {
        if(err) return next(err);
        if(permission) return next();
        return next({status: 407, message: 'Forbidden'});
    });
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

/* POST home page. */
router.post('/:group/:controller/:action?', function(req, res, next) {

    var page = req.load.controller(req.controllerPath);
    
    if('function' === typeof(page[req.action])) {
        page[req.action]();
    } else if('function' === typeof(page[defaultAction])) {
        page[defaultAction]();
    } else {
        next();
    }
});



var Admin = require('../controller/catalog/AdminController.class');

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