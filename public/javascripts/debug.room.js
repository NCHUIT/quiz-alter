handle = window.io.connect("ws://127.0.0.1:3000");
handle.emit("joinRoom", room_id);
