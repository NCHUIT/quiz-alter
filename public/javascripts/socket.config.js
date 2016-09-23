var plainLogger = function(msg){ console.log(msg); }
var handle = window.io.connect("ws://" + location.host + "/");
handle.on('exception', plainLogger);