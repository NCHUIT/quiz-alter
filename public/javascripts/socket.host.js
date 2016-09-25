handle.on('roomCreated', plainLogger);
handle.on('roomCreated',function(data){
  window.room_id = data['info']['room_id'];

  window.localStorage[room_id] = JSON.stringify(data);

  line = document.createElement("p");
  line.innerHTML = "You've created room <b>" + room_id + "</b>";
  document.body.appendChild(line);

  link = document.createElement("a");
  link.baseURI = location.host;
  link.href = "/" + room_id;
  container = document.createElement("p");
  container.innerText = "Join me with this: ";
  $("<br />").appendTo(container);
  $(container).append(link);
  $('body').append(container);

  new QRCode(link, link.href);
});

handle.on("questList", plainLogger);

$( function(){ handle.emit("createRoom");} );
