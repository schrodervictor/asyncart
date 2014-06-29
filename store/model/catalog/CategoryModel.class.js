var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');
var model = new Model();
var async = require('async');

var CategoryModel = model.extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.collection = this.req.db.collection('category');
	},
	getCategory: function(id, callback) {
		var session = this.req.session;
		var id = id || null;
		
		// Allow callback as the first parameter
		if ('function' === typeof id) {
			var callback = id;
			var length = this.req.categories.length;
			id = this.req.categories[length - 1];
		}

		if(!id) return callback('Category id not set');

		this.getCategoryById(id, callback);

	},
	getCategoryById: function(id, callback) {
//		var session = this.req.session;
//		var id = id || null;
		
		if(!id) return callback('Category id not set');

		this.collection.findOne({id: id}, function(err, categoryData) {
			if(err) return callback(err);

			if(!categoryData) return callback('Category not found');

			callback(null, categoryData);

		});
	},

});

module.exports = CategoryModel;

