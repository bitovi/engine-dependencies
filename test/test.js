var engineDependencies = require("../engine-dependencies");

describe("Install dependency version based on engine used", function(){
	it("basics works", function(){
		engineDependencies({
			"node": {
				"0.10.x": {
					"devDependencies": {
						"jquery": "1.8.0"
					}
				},
				"0.12.x": {
					"jquery": "^1.11.2"
				}
			},
			"iojs": {
				"^3.0.0": {
					"devDependencies": {
						"jquery": "2.1.4"
					}
				}
			}
		}, done);

		function done(){
			console.log("all done");
		}
	});
});
