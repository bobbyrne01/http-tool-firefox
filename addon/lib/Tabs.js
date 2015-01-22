var Tabs = require("sdk/tabs"),
	Data = require("./Data"),
	Request = require("./Request"),
	SimpleStorage = require("./SimpleStorage"),
	worker;

exports.open = function () {
	return open();
};

function open(state) {

	Tabs.open({
		url: Data.get('html/view.html'),
		onReady: function onReady(tab) {

			worker = tab.attach({
				contentScriptFile: [Data.get('lib/tabcontent.js'), Data.get('js/controller.js')],
				onMessage: function (message) {

					var input = JSON.parse(message);

					if (input.operation === 'submit') {
						Request.submitRequest(input.query);
						SimpleStorage.getHistory().push(input.query);
					}
				}
			});

			sendMsg("history", SimpleStorage.getHistory());
		}
	});
}

exports.sendMsg = function (operation, response) {
	return sendMsg(operation, response);
};

function sendMsg(operation, response) {
	worker.port.emit(operation, response);
}
