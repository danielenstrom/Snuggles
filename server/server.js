var http = require('http');
var io = require('./lib/socket.io')

server = http.createServer(function(req, res){
    // your normal server code
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.writeBody('<h1>Space is the limit</h1>');
    res.finish();
});

server.listen(9090);

var socket = io.listen(server, { transports : ['websocket'], port : 9090});

var clients = [];

socket.on('connection', function(client){
	
  console.log("Client connected");

  client.on('message', function(e){
	var cmd = JSON.parse(e);

	if(cmd && cmd.command == 'iphone') {
		console.log("Message", e);
		socket.broadcast(e);
	}
  })

  client.on('disconnect', function(){
	console.log("Client Disconnected");

  })
});