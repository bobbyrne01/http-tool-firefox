var Request = require("sdk/request").Request,
	Tabs = require("./Tabs");

function submitRequest(queryString) {

	var query = JSON.parse(queryString);

	if (query.url.toLowerCase().indexOf("http://") < 0 &&
		query.url.toLowerCase().indexOf("https://") < 0) {

		query.url = "http://" + query.url;
	}


	var req = Request({
		url: query.url,
		headers: query.headers,
		onComplete: function (response) {

			var payload = JSON.stringify({
				text: response.text,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers
			});

			Tabs.sendMsg('response', payload);
		}
	});

	try {

		if (query.method == 'GET') {
			req.get();
		} else if (query.method == 'POST') {
			req.content = query.content;
			req.post();
		} else if (query.method == 'PUT') {
			req.content = query.content;
			req.put();
		} else if (query.method == 'HEAD') {
			req.head();
		} else if (query.method == 'DELETE') {
			req.content = query.content;
			req.delete();
		}

	} catch (e) {

		Tabs.sendMsg('error', 'Error occurred.');
	}
};

exports.submitRequest = function (query) {
	return submitRequest(query);
};
