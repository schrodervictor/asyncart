var path = require('path');

var config = {
	version: '0.0.1',
	mongo: {
		host: 'localhost',
		port: '27017',
		database: 'nodecart'
	},
	session: {
		secret: 'some secret ebh549n'
	},
	cookie: {
		maxAge: 365*24*60*60
	}
}

var environment = {
	local: {
		mode: 'local',
		port: 3000,
		enginePath: path.resolve('engine'),
	},
	staging: {
		mode: 'staging',
		port: 4000,
	},
	production: {
		mode: 'production',
		port: 5000,
	}
}
module.exports = function(mode) {
	config = merge(config, environment[mode || process.argv[2] || 'local']);
	//console.log('Config:')
	//console.dir(config);
	return config;
}

// Merge function
// Credits to Emre Erkan 
// http://stackoverflow.com/a/8625261/1240001
var merge = function() {
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