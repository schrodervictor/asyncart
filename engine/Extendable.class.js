var Extendable = module.exports = function Extendable(values) {

//	if (this.init && 'function' === typeof this.init) {
//		this.init(values);
//		return;
//	}
	
	// Always set properties in the constructor
	// otherwise it will be shared among all instances
	
	// Well, not exactly... need to research more.
	// The implementation with Object.create and prototype
	// passes in all tests...
	
	for(var key in values) {
		this[key] = values[key];
	}


};

module.exports.prototype = {
	extend: function(properties) {
		var Child = function(values) {

			// This authomatically call init function, allowing to
			// simulate an override of the original constructor
			if (this.init && 'function' === typeof this.init) {
				this.init(values);
				return;
			}

			module.exports.call(this, values);
		};

		var Parent = Child.prototype = Object.create(this);
		Child.prototype.constructor = Child;

		for(var key in properties) {
			// TODO prototype only functions. For some reason
			// the "if" statement below blocks the assigment for properties
			// The good news is that this code seems to work
			// in almost every aspect (but I don't know HOW!)

//			if((typeof properties[key]) === 'function') {
				Child.prototype[key] = properties[key];
//			} else {
//				Child[key] = properties[key];
//			}
		}
		return Child;
	},
	isExtendable: function() {
		return true;
	}
}