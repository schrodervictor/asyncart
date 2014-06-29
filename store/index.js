var config = require(__config)();
var express = require('express');
var path = require('path');
var cart = require(config.enginePath + '/Cart.class');

var store = express();

store.use(function(req, res, next) {
    req.loadPoint = __dirname;
    next();
});

// view engine setup
var templateName = 'default';
store.set('views', path.join(__dirname, 'view/template', templateName));
store.set('view engine', 'hjs');

//store.use(require('less-middleware')(path.join(__dirname, 'public')));

store.use(cart);

store.use('/a', require('./routes/ajax'));
store.use('/', require('./routes/index'));

/*
/// catch 404 and forward to error handler
store.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (store.get('env') === 'development') {
    store.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
store.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

*/
module.exports = store;
