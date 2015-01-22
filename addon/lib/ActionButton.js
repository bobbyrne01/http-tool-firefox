var {
	ActionButton
} = require("sdk/ui/button/action"),
	Tabs = require("./Tabs"),
	SimpleStorage = require("./SimpleStorage");


function init() {

	if (typeof SimpleStorage.getHistory() === 'undefined') {
		SimpleStorage.setHistory([]);
	}

	var button = ActionButton({
		id: "http-tool-actionbutton",
		label: "http-tool",
		icon: {
			"16": "./icons/16.png",
			"32": "./icons/32.png"
		},
		onClick: handleClick
	});
}

exports.init = function () {
	return init();
};

function handleClick(state) {
	Tabs.open();
}
