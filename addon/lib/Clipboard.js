var clipboard = require("sdk/clipboard");

exports.set = function (value) {
	clipboard.set(value);
};
