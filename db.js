var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var room_list = new Schema({
	room_id: String,
	host_id: String
});

var room_stat = new Schema({
	room_id: String,
	quest_id: Number,
	start_time: Date,
	duration: Number,
	ans: [{
		type: Number,
		min: 0
	}]
})

mongoose.model("room_list",room_list);
mongoose.model("room_stat",room_stat);
mongoose.connect('mongodb://localhost/quizgame-alter');
