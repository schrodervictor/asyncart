var fs = require('fs');

function mergeObj(obj1, obj2) {
	for(var attr in obj2) {
		obj1[attr] = obj2[attr];
	}
	return obj1;
}


module.exports = function(path, callback) {
	
	var pathToSearch = __dirname + path;

	var objToOutput = {};

	fs.readdir(pathToSearch, function (err, files) {
	  if (err) {
	    return callback(err);
	  }

	  console.log(files);
	  
	  
	  for(var key in files) {
	  	objToOutput = mergeObj(
	  		objToOutput,
	  		require(pathToSearch + files[key])
	  	);
	  }

	  return callback(null, objToOutput);
	
	});

}