// 8 bits, no parity, 1 stop bit

var Context = global.AudioContext || global.webkitAudioContext;
var context = new Context;

var baudrate = 300;
var win = Math.floor(context.sampleRate / baudrate);
var sp = context.createScriptProcessor(256, 1, 1);

var button = document.querySelector('button');
button.addEventListener('click', function (ev) {
    if (button.textContent === 'start') {
        sp.connect(sp.context.destination);
        button.textContent = 'stop';
    }
    else {
        sp.disconnect(sp.context.destination);
        button.textContent = 'start';
    }
});
sp.addEventListener('audioprocess', onaudio);

var data = new Buffer('hello there whateever blah blah');
var index = 0;

function onaudio (ev) {
    var output = ev.outputBuffer.getChannelData(0);
    for (var i = 0; i < win; i++) {
        if (i % 10 === 0) {
            output[i] = 0;
        }
        else if (i % 10 === 9) {
            output[i] = 1;
        }
        else {
            // least significant bit first
            var x = Math.floor(index++ / win);
            var n = Math.floor(x / 8);
            output[i] = (data[n] >> (x % 8)) % 2;
        }
    }
    for (; i < output.length; i++) {
        output[i] = 1;
    }
}
