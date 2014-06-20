var config = require('./config')();
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
var template = 'default';
app.set('views', path.join(__dirname, 'view/template/' + template));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    cookie: { maxAge: config.cookie.maxAge }
}));
//app.use(cookieSession({
//    keys: ['key1', 'key2']
//}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

//TODO Try to make cache works without this line
app.disable('etag');

var MongoClient = require('mongodb').MongoClient;
var DB = {};

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no MongoDB server running');
        err.status = 500;
        next(err);
    } else {
        // TODO Add an event emitter?
        DB = db;
    };
});

app.use(function(req, res, next) {
    // TODO Add an event listener?
    console.log('DB attached');
    req.db = DB;
    next();
});


/*
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

groups = [
    'admin',
    'common',
    'users',
];

for (var i = 0, j = groups.length; i < j; i++) {
    if(groups[i] === 'common') {
        app.use('/', require('./routes/index'));        
    } else {
        app.use('/' + groups[i], require('./routes/' + groups[i]));
    }
};*/
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/index'));

/*
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
*/
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
