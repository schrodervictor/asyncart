var Extendable = module.exports = function Extendable() {

//	if (this.init && 'function' === typeof this.init) {
//		this.init(values);
//		return;
//	}
	
	// Always set properties in the constructor
	// otherwise it will be shared among all instances
	
	// Well, not exactly... need to research more.
	// The implementation with Object.create and prototype
	// passes in all tests...
	
	var values = arguments;

	for(var key in values) {
		this[key] = values[key];
	}


};

module.exports.prototype = {
	extend: function(properties) {
		var Child = function() {

			// This authomatically call init function, allowing to
			// simulate an override of the original constructor
			if (this.init && 'function' === typeof this.init) {
				this.init.apply(this, arguments);
				return;
			}

			module.exports.apply(this, arguments);
		};

		var parent = Child.prototype = Object.create(this);
		Child.prototype.constructor = Child;

		for(var key in properties) {
			if('constructor' === key) continue;
			if('publicMethods' === key) {
				Child.prototype['publicMethods'] = merge(properties['publicMethods'], parent['publicMethods'])
			}
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
	exposedActions: {
		extend: false,
		isExtendable: false,
		isPrivate: false
	},
	isExposedAction: function(action) {
		return this.exposedActions[action] || false;
	},
	isExtendable: function() {
		return true;
	}
}


function merge() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};