var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');
var async = require('async');

var OptionsController = (new Controller()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];

		this.groupName = 'catalog';
		this.controllerName = 'options';
		this.route = 'catalog/options';
		this.template = 'catalog/options';
		this.loaderOn();
		this.data = {};
	},
	indexAction: function() {
		var self = this;

		async.series([
			// Step 1: load all options, either active or inactive
			function(callback) {
/*				self.load.model('catalog/options');

				self.modelCatalogOptions.getAll(function(err, allOptions) {
					if(err) return callback(err);
					self.data.allOptions = allOptions;
*/					callback();
/*				});
*/
			},
			//Step 2: load the active languages
			function(callback) {

				var languages = [
					'en_US',
				//	'pt_BR',
					'de_DE'
				];

				var options = [{
					id: 'color',
					idTranslations: {
						'en_US': 'color',
						'pt_BR': 'cor',
					},
					values: [
						{
							id: 'blue',
							idTranslations: {
								'en_US': 'blue',
								'pt_BR': 'azul',
							}
						},
						{
							id: 'red',
							idTranslations: {
								'en_US': 'red',
								'pt_BR': 'vermelho'
							}
						}
					],
					active: true
				}];

				self.data.options = options;
				self.data.languages = languages;
/*
				self.load.model('common/language');

				self.modelCommonLanguage.getActiveLanguages(function(err, languages) {
					if(err) return callback(err);
					self.data.languages = languages;
					callback();
				});
*/
				callback();

			}




		],
		function(err) {
			if(err) return self.next(err);

			console.log(self.data);

			self.render();


		});



	}
});

module.exports = OptionsController;