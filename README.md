[![Build Status](https://travis-ci.org/bitovi/engine-dependencies.svg?branch=master)](https://travis-ci.org/bitovi/engine-dependencies)
[![npm version](https://badge.fury.io/js/engine-dependencies.svg)](http://badge.fury.io/js/engine-dependencies)

# engine-dependencies

Specify package dependencies based on what version of Node you are using. Useful if you're trying to support Node 0.10.x, 0.12.x and IO.js.

```js
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
}, function(err){
	// all done
});
```

## License

MIT
