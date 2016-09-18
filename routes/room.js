function room(io){
	var crypto = require("crypto");
	var fs = require("fs");
	var room_list = require("mongoose").model("room_list");
	var room_stat = require("mongoose").model("room_stat")

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
			room_id = generate_id();
			client.emit('roomID', room_id);
			client.join(room_id);
			new room_list({room_id: room_id, host_id: host_id}).save();
		});
		client.on("joinRoom", function(room_id){
			client.join(room_id);
		});
		client.on("setQuest",function(quest_id){
		})
	});

	function generate_id(){
		var temp = crypto.randomeBytes(20).toString("hex");
		return temp;
	};

};

module.exports = room;
