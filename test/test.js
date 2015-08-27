var engineDependencies = require("../engine-dependencies");
var assert = require("assert");

var engineVersion = process.version;
var app = engineVersion.substr(0, 3) === "v0." ? "node" : "iojs";
var engineMajor = engineVersion.substr(0, 5);

describe("Install dependency version based on engine used", function(){
	this.timeout(10000);

	it("basics works", function(done){
		var jqueryVersion;
		if(app === "iojs") {
			jqueryVersion = "2.1.4";
		} else if(engineMajor === "v0.12") {
			jqueryVersion = "1.11.2";
		} else if(engineMajor === "v0.10") {
			jqueryVersion = "1.11.0";
		}


		engineDependencies({
			"node": {
				"0.10.x": {
					"devDependencies": {
						"jquery": "1.11.0"
					}
				},
				"0.12.x": {
					"jquery": "1.11.2"
				}
			},
			"iojs": {
				"^3.0.0": {
					"devDependencies": {
						"jquery": "2.1.4"
					}
				}
			}
		}, function(err){
			var pkg = require(__dirname + "/../node_modules/jquery/package.json");
			assert.equal(pkg.version, jqueryVersion, "got the correct version of jquery");
			done();
		});
	});
});
