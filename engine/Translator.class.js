var config = require(__config)();
var async = require('async');

function Translator(req, res, next) {
	this.req = req;
	this.res = res;
	this.next = next;
}

Translator.prototype.getTemplateTranslator = function(template, language) {

	// Allows data as single parameter
	if(!language) {
		language = this.req.language;
	}

	var defaultLanguage = config.defaultLanguage || 'en_EN';

	// TODO Make it multiple templates aware
	// falling back to default if not found
	templatePath = this.req.loadPoint
				 + '/language/' + language + '/template/default/'
				 + template.toLowerCase() + '.js';

	templatePathDefault = this.req.loadPoint
						+ '/language/' + defaultLanguage + '/template/default/'
						+ template.toLowerCase() + '.js';

	var translation = {};

	// This is the recommendation from the Node.js itself to check and use a file:
	// simply open it and handle the error. This is the best approach, because
	// of the asyncronous nature of Node.js, something could happen with the file
	// between the check and the read operations.
	try {
		translation = require(templatePath);
	// Ignoring eventual error
	} catch(err) {}

	var defaultTranslation = {};

	// Same here
	try {
		defaultTranslation = require(templatePathDefault);
	// Ignoring eventual error
	} catch(err) {}

	return function(text, render) {
		var regex = /<t>(.)*?<\/t>/g;

		var newText = text.replace(regex, function(match) {

			// Strip the <t></t> tag out.
			match = match.slice(3,-4);

			// First try to find the translation for the desired language
			if(match in translation) {
				return translation[match];

			// If not found, try the default language
			} else if (match in defaultTranslation) {
				return defaultTranslation[match];

			// In the last case, leave it unchanged
			// (but without the <t></t> tags)
			} else {
				return match;
			}
		});

		return newText;
	};

};

Translator.prototype.translateData = function(data, language, unsetTranslations) {

	var self = this;

	var defaultLanguage = config.defaultLanguage || 'en_EN';

	// Allows data as single parameter
	if('undefined' === typeof language) {
		unsetTranslations = true;
		language = self.req.language;
	}

	// Allows unsetTranslations as second parameter
	if('boolean' === typeof language) {
		unsetTranslations = language;
		language = self.req.language;
	}

	var keys = Object.keys(data);

	for (var i = 0, j = keys.length; i < j; i++) {
		var key = keys[i]

		// Maybe we want to translate null and undefined values, or even functions!

			// Skip the loop as soon as possible it is null, undefined or function
			// if(null === data[key]) continue;
			// if('undefined' === typeof data[key]) continue;
			// if('function' === typeof data[key]) continue;

		// Skip the loop if it is the translation key
		if('Translations' === key.slice(-12)) continue;

		// Found a key that has a brother key with format (key + 'Translations'),
		// Translate it
		if( (key + 'Translations') in data
			&& language in data[key + 'Translations']) {
			data[key] = data[key + 'Translations'][language];
			continue;
		
		// Fallback to default language if the desired language
		// is not found inside the translation object
		} else if ( (key + 'Translations') in data
					&& defaultLanguage in data[key + 'Translations']) {
			data[key] = data[key + 'Translations'][defaultLanguage];
			continue;
		}

		// Found an Array. In this case we have to check if it's elements
		// are values, objects or other arrays. The map method and a recursion
		// will do the job
		if(Array.isArray(data[key])) {
			data[key].map(function(elem) {
				if('object' === typeof elem || Array.isArray(elem))
					return self.translateData(elem, language, unsetTranslations);
				else
					return elem;
			});
			continue;
		}

		// Found a object. In this case we have to go down to it's elements
		// Let's use a recursion to do that
		if('object' === typeof data[key] && null !== data[key]) {
			data[key] = self.translateData(data[key], language, unsetTranslations);
			continue;
		}

	}

	// We can only unset the translation keys after the previous loop is ended
	// Other wise we could accidentally unset a translation that was needed
	// before visiting the key to be translated
	if(unsetTranslations) {

		var keys = Object.keys(data);

		for (var i = 0, j = keys.length; i < j; i++) {
			var key = keys[i]

			// No need to check for other types or do recursions
			// because the previous loop will end here after each recursion
			if('Translations' === key.slice(-12)) {
				delete data[key]
				continue;
			}

		}

	}

	return data;

}



module.exports = function(req, res, next) {
	req.translator = new Translator(req, res, next);
	console.log('Translator object created in req.translator');
	next();
}