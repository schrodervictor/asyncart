var View = function(res, template) {
	this.res = res;
	this.template = template;
};
View.prototype = {
	extend: function(properties) {
		var Child = View;
		Child.prototype = View.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	render: function(data) {
		if(this.res && this.template) {
			this.res.render(this.template, data);
		}
	}
}

// Static method
View.getInstance = function(res, template) {
	return new View(res, template);
}

module.exports = View;