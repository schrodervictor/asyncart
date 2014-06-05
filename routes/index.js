var config = require('../config')();
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no MongoDB server running');
        //err.status = 500;
        next(err);
    } else {
         var attachDB = function(req, res, next) {
            console.log('DB Object attached');
            req.db = db;
            next();
        };
		/* GET home page. */
		router.get('/', attachDB, function(req, res, next) {
		  //res.render('index', { title: 'Express' });
		  req.db.collection('test').find({}, function(err, docs) {
		  	console.log('db accessed');
		  });
		  next();
		});
		
    }
});


module.exports = router;
