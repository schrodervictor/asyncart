var config = require('../config')();
var MongoClient = require('mongodb').MongoClient;

var DB ;
var error;
MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.data, function(err, db) {
    if(err) {
        console.log('Sorry, there is no MongoDB server running');
        error.status = 500;
        error.message = 'No access to DB';
    } else {
        console.log('DB object attached');
        DB = db;
    };
});

module.exports = function() {

    return function(req, res, next) {

        if(req['db']) next();

        if(error) {
           console.log(!!error);
           next(error);
        }

        if(DB) {
            req.db = DB;
            console.log('DB object exported');
            next();
        }
        
    };

}