function room(io){
	var crypto = require("crypto");
	var fs = require("fs");
	var room_list = require("mongoose").model("room_list");
	var room_stat = require("mongoose").model("room_stat");
	var room_debug = require("debug")("room");

	var quest_list = {};

	var exception = {
						not_the_owner: "create room first",
							 not_a_room: "invalid room_id",
						 invalid_type: "invalid type",
		insufficient_argument: "insufficient argument",
								host_gone: "host gone"
	};

	fs.readFile('./public/data/quiz.json', 'utf8', function (err, data) {
    if (!err) {
      quest_list = JSON.parse(data);
    }
    else {
      throw err;
    }
  });

  fs.readFile('./secret.json', 'utf8', function(err,data){
  	if(!err) { sign_key = JSON.parse(data)['sign_key']; }
  	else { throw err; }
  });

	io.on('connect',function(client){

		//Handle room creation
		//When someone click button in index,
		// this shoud be triggered.
		//TODO: Make sure room_id is unique.

		client.on('createRoom', function(data){
			room_id = generate_id();
			client.emit('roomID', room_id);
			client.join(room_id);
			new room_list({room_id: room_id, host_id: client.id}).save();
		});


		//When client opened with link provided by the room owner,
		//  Make sure them use this to join the session.

		client.on("joinRoom", function(room_id){
			room_list.count({room_id: room_id},function(err,count){
				if(err){ throw err; };
				if(count > 0) {
					client.join(room_id);
				} else {
					client.emit("exception", exception.not_a_room);
				}
			});
		});


    // Get the list of Quests, with index and title.

		client.on("getQuest",function(data) {
			client.emit("questList",
									{
										count: quest_list.length,
										titles: quest_list.map(function(item){
											return item.title;
										})
									}
								 );
		});
    
		client.on("setQuest",function(data){
			room_debug("setQuest Triggerd");
			check_room_owned_by(client.id, function(is_owned, result){
				if( !is_owned ) {
					client.emit("exception", exception.not_the_owner);
				} else {
					room_debug("accessing data type: "+ data.type);
					if(data.type == "index"){
						room_debug("broadcasting to room: " + result.room_id);
						client.broadcast
									.to(result[0].room_id)
									.emit("setQuest",
												quest_list[data.quest_id]["choice"]
											 );
						room_debug("broadcasted indexed quest");
					} else if(data.type == "custom"){
						client.broadcast
									.to(result[0].room_id)
									.emit("setQuest",
												data["quest"]["choices"]
											 );
						room_debug("broadcasted custom quest");

					} else {
						client.emit("exception", exception.invalid_type);
					}
				}
			}); //close room owner check handle

		}); //close setQuest event handle

	  // cleanup when a host leaves.

		client.on("disconnect",function(){
			room_debug("client leaved, cleaning up.");

			room_list.find({ host_id: client.id },function(err,result){
				if(err){ throw err; };
				if(result.length > 0){
					client.broadcast
								.to(result[0].room_id)
								.emit("exception", exception.host_gone);

					room_list.remove( { host_id: client.id } ).exec();
					room_debug("room: " + result[0].room_id + " closed.");
				};
			});
		});

	}); //close connect event handle


	function generate_id(){
		var temp = crypto.randomBytes(20).toString("hex");
		return temp;
	};

	function check_room_owned_by( client_id, callback ){
		room_list.find({ host_id: client_id }, function(err, result){
			if(err) { throw err;};
			callback( !(result.length == 0), result);
		});
	};

};

module.exports = room;
