var config = require('../config')();
var express = require('express');
var path = require('path');

var app = express();

var template = 'default';

app.set('views', path.join(__dirname, '../view/template/' + template));
app.set('view engine', 'hjs');

app.get('/*', function(req, res, next) {
	console.log('Inside mounted app in /catalog');
	next({message:'Not yet working', status:500});
	//res.send('mounted app in /catalog');
});


module.exports = app;