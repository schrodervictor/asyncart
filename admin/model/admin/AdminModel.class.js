var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');

var Model = (new Model()).extend({
	collection: function() {
		if(this._collection) return this._collection;
		return this._collection = this.db.collection('admin-users');
	},
	addUser: function(data) {

	},
	editUser: function(data) {

	},
	getUser: function(id) {

	},
	

});


module.exports = Model;

