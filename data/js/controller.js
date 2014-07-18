// listen for click events on UI
window.addEventListener('click', function(event) {
	
	if (event.target.id.indexOf('submit') === 0){
		
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
		
	} else if (event.target.id.indexOf('reset') === 0){
		
		document.getElementById("method").selectedIndex = 0;
		document.getElementById("url").value = ""
		document.getElementById("headers").textContent = "";
		document.getElementById("body").textContent = "";
		document.getElementById("status").textContent = "";
		document.getElementById("statusText").textContent = "";
		document.getElementById("statusListItem").style.backgroundColor = '#F6F6F9';
	
	}else if (event.target.id.indexOf('newHeaderButton') === 0){
		
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
}, false);


// Populate Response area with data
self.port.on("response", function(responseString) {
	
	var response = JSON.parse(responseString),
		headers = "";
	
	for (var headerName in response.headers) {
		headers += headerName + " : " + response.headers[headerName] + "<br/>";
	}
	
	document.getElementById("headers").innerHTML = headers;
	document.getElementById("body").textContent = response.text;
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