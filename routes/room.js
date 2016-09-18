function room(io){
	var crypto = require("crypto");
	io.on('connect',function(client){
		client.on('createRoom', function(data){
			room_id = crypto.randomBytes(20).toString("hex");
			client.emit('roomID', room_id);
			client.join(room_id);
		});
	});

};

module.exports = room;
