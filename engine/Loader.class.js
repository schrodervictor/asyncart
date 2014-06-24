var fs = require('fs');
var config = require('../config')();

function Loader(req, res, next) {
	this.req = req;
	this.res = res;
	this.next = next;

	this.controllerPath = config.controllerPath;
	this.modelPath = config.modelPath;
	this.viewPath = config.viewPath;
}

Loader.prototype.model = function(modelName, parent) {

	console.log(this.name);

	var model = this.normalize('model', modelName, 'class');

	try {
		var Model = require(model.path);
	} catch(err) {
		throw new Error('Error loading model: ' + modelName);
	}


	if(!!parent) {

		parent[model.objectName] = new Model(this.req, this.res);
		return parent[model.objectName];

	} else {

		return new Model(this.req, this.res);

	}

}

Loader.prototype.controller = function(controllerName, parent) {

	console.log(this.name);

	var controller = this.normalize('controller', controllerName, 'class');

	try {
		var Controller = require(controller.path);
	} catch(err) {
		throw new Error('Error loading controller: ' + controllerName);
	}


	if(!!parent) {

		parent[controller.objectName] = new Controller(this.req, this.res);
		return parent[controller.objectName];

	} else {

		return new Controller(this.req, this.res);

	}

}

Loader.prototype.normalize = function(type, name, camelize) {

	var route = name.split('/');
	var group = route.shift().toLowerCase();
	var component = route.shift();
	var realName = '';
	
	if(camelize === 'class') {

		var parts = component.split('-');
		for (var i = 0, j = parts.length; i < j; i++) {
			realName += parts[i].charAt(0).toUpperCase() + parts[i].substr(1).toLowerCase();
		}

	}

	if(    camelize === 'object'
		|| camelize === 'function') {

		var parts = component.split('-');
		realName += parts[0].toLowerCase();
		for (var i = 1, j = parts.length; i < j; i++) {
			realName += parts[i].charAt(0).toUpperCase() + parts[i].substr(1).toLowerCase();
		}

	}

	if(    camelize === 'none'
		|| camelize === 'template'
		|| !camelize) {

		realName = component.toLowerCase();
	
	}

	var path;
	var complement;
	var objectName;

	switch (type) {
		case 'model':
			path = config.modelPath;
			complement = 'Model.class.js';
			objectName = type
					   + group.charAt(0).toUpperCase()
					   + group.substr(1).toLowerCase()
					   + realName;
			break;
		case 'controller':
			path = config.controllerPath;
			complement = 'Controller.class.js';
			objectName = type
					   + group.charAt(0).toUpperCase()
					   + group.substr(1).toLowerCase()
					   + realName;
			break;
		case 'template':
			path = config.templatePath;
			complement = '';
			break;
		default:
			path = '.';
			complement = '.js'
			break;
	}

	path += '/' + group
		 +  '/' + realName + complement;

	return {path: path, objectName: objectName};

} 


module.exports = function(req, res, next) {
	req.loader = new Loader(req, res, next);
	console.log('Loader object created in req.loader');
	next();
}