var config = require('../config')();
var ContentModel = require('../model/ContentModel.class');
var MongoClient = require('mongodb').MongoClient;
var DB = {};

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no MongoDB server running');
        err.status = 500;
        next(err);
    } else {
        DB = db;
    };
});


var dataMockup = {
	user: 'Test User',
	username: 'testuser',
	password: 'pass'
};

var id = 'old id';
var newId = '';

describe('ContentModel class:', function() {

	function waiting(){		 
		return setTimeout(function(){
			return true;
		}, 500);
	}
			 
	

	it('should have the DB functions', function(next) {
	waitsFor(function() { return true; }, 1000);
		 //expect(done).toBe(true);
			var contentModel = new ContentModel(DB);
			expect(contentModel.db).toBeDefined();
			expect(contentModel.collection).toBeDefined();
			expect(contentModel.extend).toBeDefined();
			expect(contentModel.insert).toBeDefined();
			expect(contentModel.update).toBeDefined();
			expect(contentModel.getList).toBeDefined();
			expect(contentModel.remove).toBeDefined();
			expect(contentModel.lastID).toBeDefined();
			next();
	});
	it('should insert data', function(next) {
	waitsFor(function() { return true; }, 1000);
			 //expect(done).toBe(true);
			var contentModel = new ContentModel(DB);
			contentModel.insert(dataMockup, function(err, result) {
				expect(err).toBe(null);
				expect(result).toBe(1);
				console.log(id);
				id = data.id;
				newId = data.id;
				expect(id).not.toBe('old id');
				next();
			});
	});
	it('should update data', function(next) {
		waitsFor(function() { return true; }, 1000);
		 //expect(done).toBe(true);
			var contentModel = new ContentModel(DB);
			dataMockup.user = 'New Test User';
			dataMockup.id = id;
			contentModel.update(dataMockup, function(err, result) {
				expect(err).toBe(null);
				expect(result).toBe(1);
				next();
			});
	});

	it('should be able to find user by ID', function(next) {
	waitsFor(function() { return true; }, 1000);
 //expect(done).toBe(true);
			var contentModel = new ContentModel(DB);
			contentModel.getUser(id, function(err, data) {
				console.log(id);
				expect(err).toBe(null);
				expect(data.id).toBe(newId);
				next();
			});



	});
});
