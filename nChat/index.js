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

var userList = {};

io.on('connection', function(socket)
{
	console.log('a user connected, socket id: ' + socket.id);
	
	console.log('presenting new user to others...');
	
	userList[socket.id] = { name: 'Anonymous' };
	
	io.sockets.emit('newuserconnected', userList);
	
	socket.on('disconnect', function()
	{
		console.log(socket.id + ' disconnected');
		delete userList[socket.id];
		io.sockets.emit('userdisconnected', userList);
	});
	
	socket.on('chatmessage', function(chatpacket)
	{	
		console.log('(' + chatpacket.userid + ') ' + chatpacket.sender + ': ' + chatpacket.msg);
	
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
		
		if(userList[chatpacket.userid].name != chatpacket.sender)
		{
			userList[chatpacket.userid].name = chatpacket.sender;
			io.sockets.emit('namechanged', userList);
		}
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