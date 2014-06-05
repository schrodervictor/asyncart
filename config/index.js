var config = {
	local: {
		mode: 'local',
		port: 3000,
		mongo: {
			host: 'localhost',
			port: '27017'
		}
	},
	staging: {
		mode: 'staging',
		port: 4000,
		mongo: {
			host: 'localhost',
			port: '27017'
		}
	},
	production: {
		mode: 'production',
		port: 5000,
		mongo: {
			host: 'localhost',
			port: '27017'
		}
	}
}
module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}