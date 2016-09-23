handle.on('roomCreated', plainLogger);
handle.on('roomCreated',function(data){
  window.room_id = data['info']['room_id'];

  window.localStorage[room_id] = JSON.stringify(data);

  line = document.createElement("p");
  line.innerHTML = "You're joined room <b>" + room_id + "</b>";
  document.body.appendChild(line);

  link = document.createElement("a");
  link.baseURI = location.host;
  link.href = "/" + room_id;
  link.innerHTML = room_id;
  container = document.createElement("p");
  container.innerHTML = "Join me with this "
  container.appendChild(link);
  container.innerHTML += " buddy.";
  document.body.appendChild(container);
});

handle.on("questList", plainLogger);

handle.emit("createRoom");
