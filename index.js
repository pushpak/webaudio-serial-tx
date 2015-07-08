var uart = require('uart-pack-frame');
var Writable = require('readable-stream/writable');
var defined = require('defined');
var inherits = require('inherits');

module.exports = Serial;
inherits(Serial, Writable);

function Serial (opts) {
    if (!(this instanceof Serial)) return new Serial(opts);
    Writable.call(this);
    var self = this;
    
    var context = opts.context;
    if (!context) {
        var Context = global.AudioContext || global.webkitAudioContext;
        var context = new Context;
    }
    this._serial = uart();
    this._bits = [];
    
    var baudrate = defined(opts.baud, 9600);
    var polarity = defined(opts.polarity, -1);
    if (String(polarity).toLowerCase() === 'ttl') {
        // arduinos, ftdi, all microcontroller serial ports, max 232 cip
        polarity = -1;
    }
    else if (String(polarity).toLowerCase() === 'rs232') {
        // rs232 cables; db25, db9
        polarity = 1;
    }
    
    var win = Math.floor(context.sampleRate / baudrate);
    this.sp = context.createScriptProcessor(2048, 1, 1);
    this.sp.addEventListener('audioprocess', onaudio);
    this._stopped = false;
    
    function onaudio (ev) {
        if (self._serial.stopped && self._bits.length === 0) {
            self.sp.context.suspend();
        }
        
        var output = ev.outputBuffer.getChannelData(0);
        var bits = self._bits;
        if (bits.length < output.length) {
            var n = Math.ceil(output.length / win);
            var nbits = self._serial.readBits(n);
            for (var i = 0; i < nbits.length; i++) {
                for (var j = 0; j < win; j++) {
                    bits.push(nbits[i]);
                }
            }
        }
        for (var i = 0; i < output.length; i++) {
            output[i] = (bits.shift() ? -1 : 1) * polarity;
        }
    }
}

Serial.prototype._write = function (buf, enc, next) {
    this._serial.write(buf);
    this.sp.context.resume();
    next();
};

Serial.prototype.flush = function () {
    this._bits.splice(0);
    this._serial.flush();
};

Serial.prototype.start = function (dst) {
    this._stopped = false;
    if (!this._connected) {
        this.sp.connect(dst || this.sp.context.destination);
    }
    this._connected = true;
    this.sp.context.resume();
};

Serial.prototype.stop = function () {
    this._stopped = true;
    this._serial.flush();
    this._bits.splice(0);
    this._connected = false;
    this.sp.disconnect(this.sp.context.destination);
};
