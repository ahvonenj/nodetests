var socket = io();
	
socket.on('newuserconnected', function(userlist)
{ 
	var d = new Date();
	var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	
	var messageBody = '<tr><td><div class = "chat_message_container">[' + t + '] a new user joined the chat!</div></td></tr>';
	
	$('#chat_message_table #message_table_last_row').before(messageBody);
	
	var objDiv = document.getElementById("chat_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;
	
	$('#user_table tr:not(#user_table_last_row):not(:first-child)').remove();
	
	for(var user in userlist)
	{	
		var userBody = '<tr><td><div class = "user_name_container" data-userid = "' + user + '">' + userlist[user].name + '</div></td></tr>';
		$('#user_table #user_table_last_row').before(userBody);
	}
	
	var objDiv = document.getElementById("user_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;
});

socket.on('userdisconnected', function(userlist)
{ 
	$('#user_table tr:not(#user_table_last_row):not(:first-child)').remove();
	
	for(var user in userlist)
	{	
		var userBody = '<tr><td><div class = "user_name_container" data-userid = "' + user + '">' + userlist[user].name + '</div></td></tr>';
		$('#user_table #user_table_last_row').before(userBody);
	}
	
	var objDiv = document.getElementById("user_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;


	var d = new Date();
	var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	
	var messageBody = '<tr><td><div class = "chat_message_container">[' + t + '] user disconnected from chat</div></td></tr>';
	
	$('#chat_message_table #message_table_last_row').before(messageBody);
	
	var objDiv = document.getElementById("chat_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;
});

socket.on('namechanged', function(userlist)
{ 
	$('#user_table tr:not(#user_table_last_row):not(:first-child)').remove();
	
	for(var user in userlist)
	{	
		var userBody = '<tr><td><div class = "user_name_container" data-userid = "' + user + '">' + userlist[user].name + '</div></td></tr>';
		$('#user_table #user_table_last_row').before(userBody);
	}
	
	var objDiv = document.getElementById("user_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;

	/*
		var d = new Date();
		var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		
		var messageBody = '<tr><td><div class = "chat_message_container">[' + t + '] user changed name</div></td></tr>';
		
		$('#chat_message_table #message_table_last_row').before(messageBody);
		
		var objDiv = document.getElementById("chat_cell_inner");
		objDiv.scrollTop = objDiv.scrollHeight;
	*/
});

	
socket.on('newchatmessage', function(chatpacket)
{ 
	var d = new Date();
	var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	
	var messageBody = '<tr><td><div class = "chat_message_container">[' + t + '] ' + chatpacket.sender + ': ' + chatpacket.msg + '</div></td></tr>';
	
	$('#chat_message_table #message_table_last_row').before(messageBody);
	
	var objDiv = document.getElementById("chat_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;
});

$(document).on('click', '#chat_submit', function()
{
	var accepted = true;
	
	if($('#chat_sender').val() == '')
	{
		$('#chat_sender').addClass('error_border');
			
		setTimeout(function()
		{
			$('#chat_sender').removeClass('error_border');
		}, 200);
		
		accepted = false;
	}
	
	if($('#chat_msg').val() == '')
	{
		$('#chat_msg').addClass('error_border');
		
		setTimeout(function()
		{
			$('#chat_msg').removeClass('error_border');
		}, 200);
		
		accepted = false;
	}	
	
	if(accepted)
	{
		socket.emit('chatmessage', 
		{
			sender: $('#chat_sender').val(),
			msg: $('#chat_msg').val(),
			userid: socket.id
		});
		
		$('#chat_msg').val('');
	}
	
	var objDiv = document.getElementById("chat_cell_inner");
	objDiv.scrollTop = objDiv.scrollHeight;
});
	
$(document).keypress(function(event)
{
 
	var keycode = (event.keyCode ? event.keyCode : event.which);
	
	if(keycode == '13')
	{
		$('#chat_submit').click();
	}
 
});