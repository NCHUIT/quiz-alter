handle = window.io.connect("ws://127.0.0.1:3000");
handle.on('roomID', function(data) {
  console.log("RoomID: "+ data);
});
handle.emit("createRoom");
