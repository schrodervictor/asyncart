var Model = function(db) {
	this.db = db;
};

Model.prototype = {
	extend: function(properties) {
		var Child = Model;
		Child.prototype = Model.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	setDB: function(db) {
		this.db = db;
	},
	collection: function() {
		if(this._collection) return this._collection;
		return this._collection = this.db.collection('fastdelivery-content');
	}
}

module.exports = Model;