var Extendable = require('./Extendable.class');

var Model = (new Extendable()).extend({
	init: function(db) {
		this.db = db;
	},
	setDB: function(db) {
		this.db = db;
	},
	collection: function() {
		if(this._collection) return this._collection;
		return this._collection = this.db.collection('fastdelivery-content');
	}
});


module.exports = Model;

