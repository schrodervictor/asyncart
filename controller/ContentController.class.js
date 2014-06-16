var Controller = require('../engine/Controller.class');
var View = require('../engine/View.class');
var ContentModel = require('../model/ContentModel.class');

var ContentController = (new Controller()).extend({
	name: 'Content',
	run: function(req, res, next) {
		self = this;
		self.getModel(req);
		var data = {
			user:'Victor',
			pass: 'pass',
			username: 'schrodervictor'
		}
		self.model.insert(data, function(err, result) {
			console.log(err);
			console.log(result[0]);
			data.id = result[0].id;
			data.pass = 'pass1';
			self.model.update(data, function(err, result) {
				console.log(err);
				console.log(result);
			});
		});




	},
	getModel: function(req) {
		this.model = this.model || new ContentModel(req.db);
		return this.model;
	}
});

module.exports = ContentController;