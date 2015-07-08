var serial = require('../');
var port = serial({ baud: 9600 });

port.write(new Buffer(5000).fill('wow'));
port.start();
