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
    
    var baudrate = defined(opts.baud, 300);
    var polarity = defined(opts.polarity, 1);
    
    var win = Math.floor(context.sampleRate / baudrate);
    this.sp = context.createScriptProcessor(2048, 1, 1);
    this.sp.addEventListener('audioprocess', onaudio);
    
    function onaudio (ev) {
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
    next();
};

Serial.prototype.start = function (dst) {
    this.sp.connect(dst || this.sp.context.destination);
};

Serial.prototype.stop = function (dst) {
    this.sp.disconnect(dst || this.sp.context.destination);
};
