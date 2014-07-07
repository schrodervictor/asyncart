var Extendable = module.exports = function Extendable() {

};

module.exports.prototype = {
	extend: function(properties) {
		var Child = function() {

			// call the parent's constructor
			// module.exports.apply(this, arguments);

			// This authomatically call init function, allowing to
			// simulate an override of the original constructor
			this.init.apply(this, arguments);
		};

		var parent = Object.create(this);
		Child.prototype = parent;
		Child.prototype.constructor = Child;

		for(var key in properties) {
			if('constructor' === key) throw new Error('"contructor" is a reserved word in Extendable Classes');
			if('extend' === key) throw new Error('"extend" is a reserved word in Extendable Classes');
			Child.prototype[key] = properties[key];
		}

		// Return only the class, not the instance.
		return Child;
	},
	init: function() {},


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