var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');
var model = new Model();
var async = require('async');

var CartModel = model.extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.collection = this.req.db.collection('product');
	},

});

module.exports = CartModel;

