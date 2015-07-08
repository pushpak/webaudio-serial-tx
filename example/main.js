var serial = require('../');
var port = serial({ baud: 9600, polarity: 1 });
port.start();

var form = document.querySelector('form');
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    port.write(form.elements.text.value);
});
