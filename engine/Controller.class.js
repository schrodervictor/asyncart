var util = require('util');
var Controller = module.exports = function Controller(properties) {
	// Always set properties in the constructor
	// otherwise it will be shared among all instances
	
	// Well, not exactly... need to research more.
	// The implementation with Objecte.create and prototype
	// passes in all tests...
	
	//for(var key in properties) {
	//	this[key] = properties[key];
	//}
};

Controller.prototype = {
	extend: function(properties) {
		var Child = function(properties) {
			 module.exports.call(this, properties);
		}
		Child.prototype = Object.create(module.exports.prototype);
		Child.prototype.constructor = Child;
		for(var key in properties) {
			// TODO prototype only functions. For some reason
			// the "if" statement below blocks the assigment for properties
			// The good news is that this code seems to work
			// in every aspect (but I don't know HOW!)

//			if(typeof(properties[key]) === 'function') {
				Child.prototype[key] = properties[key];
//			} else {
//				Child[key] = properties[key];
//			}
		}
		return Child;
	},
	action: function(params) {
		
	},
	run: function() {

	}
}