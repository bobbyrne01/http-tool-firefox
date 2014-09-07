window.onload = function() {
	var requestTabs = new ddtabcontent('requestTabs'),
		responseTabs = new ddtabcontent('responseTabs');
	
	requestTabs.init();
	responseTabs.init();
};


// listen for click events on UI
window.addEventListener('click', function(event) {
	
	if (event.target.id.indexOf('submit') === 0){
		
		httprequester.submit();
		
	} else if (event.target.id.indexOf('reset') === 0){
		
		httprequester.reset();
	
	}else if (event.target.id.indexOf('newHeaderButton') === 0){
		
		httprequester.addHeader();
	}
}, false);


// listen for enter pressed on `url` input
document.getElementById('url').onkeypress = function(e){
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    
    	httprequester.submit();
    }
}


// Populate Response area with data
self.port.on("response", function(payload) {
	
	var response = JSON.parse(payload);
	
	
	// handle headers
	if (Object.getOwnPropertyNames(response.headers).length){
		
		document.getElementById("headers").textContent = "";
		var table = document.createElement('table');
		
		table.border = 1;
		table.style = 'border-collapse:collapse';
		
		for (var headerName in response.headers) {
			
			var tr = document.createElement("tr"),
				tdName = document.createElement("td"),
				tdValue = document.createElement("td");
			
			tdValue.className = 'wrapAll';
			
			tdName.appendChild(document.createTextNode(headerName));
			tdValue.appendChild(document.createTextNode(response.headers[headerName]));
			tr.appendChild(tdName);
			tr.appendChild(tdValue);
			table.appendChild(tr);
		}
		
		document.getElementById("headers").appendChild(table);
		
	}else{
		
		document.getElementById("headers").textContent = "No headers.";
	}
	
	
	
	// handle body content
	if (response.text === ""){
		document.getElementById("body").textContent = "No body content.";
	}else{
		
		document.getElementById("body").textContent = "";
		var pre = document.createElement('pre');
		pre.id = "bodyCode";
		
		try{
			
			document.getElementById("body").appendChild(pre);
			
			var highlightedJson = syntaxHighlight(JSON.stringify(JSON.parse(response.text), undefined, 4)),
				range = document.createRange();
			
			range.selectNode(pre);
			var docFrag = range.createContextualFragment(highlightedJson);

			document.getElementById("bodyCode").appendChild(docFrag);
		
		}catch(e){
			pre.appendChild(document.createTextNode(response.text));
			document.getElementById("body").appendChild(pre);
		}
	}
	
	
	// handle status code and text
	document.getElementById("status").textContent = response.status;
	document.getElementById("statusText").textContent = response.statusText;
	
	if (response.status >= 200 && response.status <= 299){
		document.getElementById("statusListItem").style.backgroundColor = '#99FF66';
	}else if (response.status >= 300 && response.status <= 399){
		document.getElementById("statusListItem").style.backgroundColor = '#FFFF66';
	}else if (response.status >= 400 && response.status <= 499 || response.status === 0){
		document.getElementById("statusListItem").style.backgroundColor = '#FF3333';
	}else if (response.status >= 500 && response.status <= 599){
		document.getElementById("statusListItem").style.backgroundColor = '#CC3333';
	}
});


self.port.on("error", function(payload) {
	document.getElementById("statusListItem").style.backgroundColor = '#FF3333';
});


var httprequester = {
		
	submit: function() {
		var headers = {};

		// Identify if headers need to be sent in request
		for (var i = 1, row; row = document.getElementById("headersRequestTable").rows[i]; i++) {
			
			if (!(row.cells[0].firstElementChild.value === '' || row.cells[1].firstElementChild.value === '')){
				headers[row.cells[0].firstElementChild.value] = row.cells[1].firstElementChild.value;
			}	
		}


		var input = JSON.stringify({
			operation: 'submit',
			query: JSON.stringify({
				url: document.getElementById("url").value,
				method: document.getElementById("method").options[document.getElementById("method").selectedIndex].text,
				content: document.getElementById("bodyRequestListItem").value,
				headers: headers
			})
		});

		self.postMessage(input);
	},
	
	reset: function() {
		document.getElementById("method").selectedIndex = 0;
		document.getElementById("url").value = ""
		document.getElementById("headers").textContent = "";
		document.getElementById("body").textContent = "";
		document.getElementById("status").textContent = "";
		document.getElementById("statusText").textContent = "";
		document.getElementById("statusListItem").style.backgroundColor = '#F6F6F9';
	},
	
	
	addHeader: function() {
		var tr = document.createElement("tr"),
			tdName = document.createElement("td"),
			tdValue = document.createElement("td"),
			inputName = document.createElement("input"),
			inputValue = document.createElement("input"),
			inputButton = document.createElement("input");
		
		inputName.length = 25;
		inputValue.length = 25;
		inputButton.length = 25;
		inputButton.type = "button";
		inputButton.value = "-";
		inputButton.onclick = function(){
			document.getElementById('headersRequestTable').deleteRow(this.parentNode.rowIndex);
		};
		
		tdName.appendChild(inputName);
		tdValue.appendChild(inputValue);
		tr.appendChild(tdName);
		tr.appendChild(tdValue);
		tr.appendChild(inputButton);
		document.getElementById("headersRequestTable").appendChild(tr);
	}
}


// Taken from: http://stackoverflow.com/a/7220510
function syntaxHighlight(json) {
	
	var jsonElements;
	
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    	
    	var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}