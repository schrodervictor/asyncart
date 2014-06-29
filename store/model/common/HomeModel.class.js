var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');
var crypto = require('crypto');
var model = new Model();

var HomeModel = model.extend({
	insert: function(data, callback) {
		data.id = crypto.randomBytes(20).toString('hex');
		this.lastID = data.id;
		this.collection().insert(data, {}, callback || function(){});
	},
	update: function(data, callback) {
		this.collection().update({id: data.id}, data, {}, callback || function(){});
	},
	getList: function(callback, query) {
		this.collection().find(query || {}.toArray(callback));
	},
	remove: function(id, callback) {
		this.collection().findandModify({id: id}, [], {}, {remove:true}, callback);
	},
	getUser: function(id, callback) {
		this.collection().findOne({id: id}, callback);
	},
	lastID: null
});

module.exports = HomeModel;

