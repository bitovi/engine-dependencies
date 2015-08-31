var semver = require("semver");
var spawn = require("child_process").spawn;
var findupNodeModules = require("findup-node-modules");
var path = require("path");

module.exports = engineDependencies;

var apps = { node: true, iojs: true };
var depTypes = { dependencies: true, devDependencies: true };

var engineVersion = process.version;
var app = engineVersion.substr(0, 3) === "v0." ? "node" : "iojs";
var isWin = /^win/.test(process.platform);

function engineDependencies(options, moduleName, callback){
	if(typeof options === "string") {
		moduleName = options;
		options = undefined;
	}
	if(typeof moduleName === "function") {
		callback = moduleName;
		moduleName = undefined;
	}

	// First see if we are in production
	var installDevDependencies = process.env.NODE_ENV !== "production";
	if(moduleName) {
		// If we are inside a node_modules folder then do not install them.
		installDevDependencies = !findupNodeModules(moduleName);
		// We might be in the root folder for the project, check that
		if(!installDevDependencies) {
			installDevDependencies = path.dirname(process.cwd()) === moduleName;
		}
	}

	// Get the package.json engineDependencies
	if(!options) {
		var cwd = findupNodeModules(moduleName) || process.cwd();
		var pkgJsonPath = path.join(cwd, "package.json");
		var pkg = require(pkgJsonPath);
		options = pkg.engineDependencies;
	}

	var dependencies;
	var devDependencies;

	// At this top level the key is the app name (node or iojs);
	var engineOptions = findWhere(options, function(appOption){
		return appOption === app;
	});

	var dependencyOptions = findWhere(engineOptions, function(engineOption){
		return semver.satisfies(engineVersion, engineOption);
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

	if(devDependencies && installDevDependencies) {
		var devInstalls = mapOf(devDependencies, npmInstall);
		installs = installs.concat(devInstalls);
	}

	// Now installs is an array of thunks that will npm install stuff.
	// go through it one-at-a-time and install them all.
	thunkAll(installs, function(err){
		// Should be done, check for the error
		callback && callback(err);
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

function thunkAll(thunks, callback){
	var thunk = thunks.shift();
	if(!thunk) {
		callback();
		return;
	}

	thunk(function(err){
		if(err) {
			return callback(err);
		}
		thunkAll(thunks, callback);
	});
}

var npmCmd = isWin ? "npm.cmd" : "npm";
function npmInstall(packageName, packageVersion){
	return function(done){
		console.error("Engine Dependencies:", packageName, packageVersion);

		var installString = packageName + "@" + packageVersion;
		var args = ["install", installString];
		var child = spawn(npmCmd, args);
		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		child.on("exit", done);
	};
}
