var Extendable = require('./Extendable.class');

var Model = (new Extendable()).extend({
	setDB: function(db) {
		this.db = db;
	},
});


module.exports = Model;

