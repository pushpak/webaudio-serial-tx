var serial = require('../');
var port = serial({ baud: 9600, polarity: 'ttl' });

var button = document.querySelector('button');
button.addEventListener('click', function (ev) {
    if (button.textContent === 'start') {
        button.textContent = 'stop';
        port.start();
    }
    else {
        button.textContent = 'start';
        port.stop();
    }
});

var form = document.querySelector('form');
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    port.write(form.elements.text.value + '\n');
    form.elements.text.value = '';
});
