var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket)
{
	console.log('a user connected');
	
	socket.on('disconnect', function()
	{
		console.log('user disconnected');
	});
	
	socket.on('chatmessage', function(chatpacket)
	{		
		var entityMap = 
		{
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;'
		};
		
		chatpacket.msg = escapeHtml(chatpacket.msg);
		chatpacket.sender = escapeHtml(chatpacket.sender);
		
		io.sockets.emit('newchatmessage', chatpacket);
	});
});

function escapeHtml(string) 
{
	return String(string).replace(/[&<>"'\/]/g, function (s) 
	{
		return entityMap[s];
	});
}



http.listen(3000, function()
{
	console.log('listening on *:3000');
});