var plainLogger = function(msg){ console.log(msg); }
var handle = window.io.connect("ws://" + location.host + "/");
handle.on('error', plainLogger);