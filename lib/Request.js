var Request = require("sdk/request").Request,
	Tabs = require("./Tabs");

function submitRequest(queryString) {

	var query = JSON.parse(queryString);

	var req = Request({
		url: query.url,
		onComplete: function (response) {		
			
			var payload = JSON.stringify({
				text: response.text,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers});
				
			Tabs.sendMsg(payload);
		}
	});

	if (query.method == 'GET'){
		req.get();
	}else if (query.method == 'POST'){
		req.content = query.content;
		req.post();
	}else if (query.method == 'PUT'){
		req.content = query.content;
		req.put();
	}else if (query.method == 'HEAD'){
		req.head();
	}else if (query.method == 'DELETE'){
		req.content = query.content;
		req.delete();
	}
};

exports.submitRequest = function(query){
	return submitRequest(query);
};
