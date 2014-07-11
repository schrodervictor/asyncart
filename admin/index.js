var config = require(__config)();
var express = require('express');
var path = require('path');

var admin = express();

admin.use(function(req, res, next) {
    req.loadPoint = __dirname;
    req.mountPoint = req.originalUrl.replace(req.url, '');
    console.log('mountPoint: ' + req.mountPoint);
    next();
});

// view engine setup
var templateName = 'default';
admin.set('views', path.join(__dirname, 'view/template', templateName));
admin.set('view engine', 'hjs');

admin.use('/', require('./routes/index'));

module.exports = admin;
