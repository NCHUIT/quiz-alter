function room(io){
	var crypto = require("crypto");
	var fs = require("fs");

	var quest_list ={}

	fs.readFile('./public/data/quiz.json', 'utf8', function (err, data) {
    if (!err) {
      quest_list = JSON.parse(data);
    }
    else {
      throw err;
    }
  });


	io.on('connect',function(client){
		client.on('createRoom', function(data){
			room_id = crypto.randomBytes(20).toString("hex");
			client.emit('roomID', room_id);
			client.join(room_id);
		});
	});

};

module.exports = room;
