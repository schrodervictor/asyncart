// User.class.js
var crypto = require('crypto');

function User(req) {
	this.req = req;
};

User.prototype = {

	isLogged: function(callback) {

		console.log('Login status checked');

		callback(null, true);
	},
	hasPermission: function(callback) {

		console.log('Permission checked');

		callback(null, true);
	}
};


User.prototype.constructor = User;

module.exports = User;