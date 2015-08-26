
module.exports = engineDependencies;

var apps = { node: true, iojs: true };
var depTypes = { dependencies: true, devDependencies: true };

var engineVersion = process.version;
var app;

function engineDependencies(options){
	// TODO get options from package.json engineDependencies
	var dependencies;
	var devDependencies;

	// At this top level the key is the app name (node or iojs);
	var engineOptions = findWhere(options, function(appOption){
		return appOption === app;
	});

	var dependencyOptions = findWhere(engineOptions, function(engineOption){
		return isCompatible(engineOption, engineVersion);
	});

	// Check to see if this is just version numbers or not
	var exampleDepType = Object.keys(dependencyOptions)[0];
	if(depTypes[exampleDepType]) {
		dependencies = dependencyOptions.dependencies;
		devDependencies = dependencyOptions.devDependencies;
	} else {
		dependencies = dependencyOptions;
	}

	// Now loop through and install the versions.
	var installs = [];
	if(dependencies) {
		installs = mapOf(dependencies, npmInstall);
	}

	// TODO how do I know if I need to install devDependencies?
	if(devDepencencies && false) {
		var devInstalls = mapOf(devDependencies, npmInstall);
		installs = installs.concat(devInstalls);
	}

	// Now installs is an array of thunks that will npm install stuff.
	// go through it one-at-a-time and install them all.
	thunkAll(installs, function(err){
		// TODO should be done, check for the error
	});
};

function findWhere(obj, callback){
	var keys = Object.keys(obj);
	var result;
	keys.forEach(function(key){
		var value = obj[key];
		var found = callback(key, value);
		if(found) {
			result = value;
			return false;
		}
	});
	return result;
}

function mapOf(obj, callback){
	var keys = Object.keys(obj);
	var results = [];
	keys.forEach(function(key){
		var value = obj[key];
		results.push(callback(key, value));
	});
	return results;
}

// TODO make this work
function isCompatible(){
	return true;
}

function thunkAll(thunks, callback){
	var thunk = thunks.shift();
	if(!thunk) callback();

	thunk(function(err){
		if(err) {
			return callback(err);
		}
		thunkAll(thunks, callback);
	});
}

function npmInstall(packageName, packageVersion){
	// TODO do an actual npm Install
	return function(){

	};
}
