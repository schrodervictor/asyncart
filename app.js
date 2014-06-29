global.__config = require.resolve('./config');
var config = require(__config)();
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var bodyParser = require('body-parser');
var database = require('./engine/Database');
var sessionStore = require('./engine/sessionStore.obj');
var loader = require('./engine/Loader.class');

var app = express();

app.use(function(req, res, next) {
    req.loadPoint = __dirname;
    req.appRoot = __dirname;
    next();
});

// view engine setup
var templateName = 'default';
app.set('views', path.join('./store/view/template', templateName));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    cookie: { maxAge: config.cookie.maxAge },
    store: sessionStore
}));

app.use(express.static(path.join(__dirname, 'public')));

//TODO Try to make cache works without this line
app.disable('etag');

app.use(loader);
app.use(database());
app.use('/admin', require('./admin'));
app.use('/', require('./store'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
