var socket;

$(function(){
	
	$("#up").click(function(){
		if(socket) {
			var cmd = {};
			cmd.command = 'iphone';
			cmd.direction = 'up';
			socket.send(JSON.stringify(cmd));
			cmd = null;
		}
	});
	
	socket = new io.Socket('localhost', {port : 9090});
	socket.on('connect', socketConnect);
	socket.on('disconnect', socketDisconnect);
	socket.on('message', socketMessage);
	socket.connect();
	
});

function socketMessage(m) {
	debug("Message Recived");
	var response = JSON.parse(m);
	debug(response);
}

function socketDisconnect(e) {
	debug("Disconnected from server");
}

function socketConnect(e) {
	debug("Connected To Socket Server");
	$("#status").text("Connected to server");
}

var debug = function(txt) {
	if(console && console.log) {
		console.log(txt);
	}
}