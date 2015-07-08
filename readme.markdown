# webaudio-serial-tx

transmit serial data over webaudio in the browser

[view a demo](https://f47ea724d3b21e7288e24818fe44a81ab55fe0f7.htmlb.in)

# example

``` js
var serial = require('webaudio-serial-tx');
var port = serial({ baud: 9600 });

port.write(new Buffer(5000).fill('wow'));
port.start();
```

# api

``` js
var serial = require('webaudio-serial-tx');
```

## var port = serial(opts)

Create a new writable stream `port` that will play UART framed serial data
through the system speakers using webaudio.

* `opts.context` - the audio context to use
* `opts.baud` - the number of bits per second of framed data to transmit
* `opts.autosuspend` - automatically suspend the audio playback at the end of
the data queue to save cpu and battery life. default: true
* `opts.polarity` - the polarity: `'ttl'` (-1) or `'rs232'` (+1).

For microcontroller serial ports and arduinos set `opts.polarity` to `'tty'`.

For rs232 cables, set `opts.polarity` to `'rs232'`.

You might need to flip the polarity if you have a custom circuit.

## port.write(buf)

Pack `buf` and send over the wire.

## port.start()

Start the audio playback.

## port.stop()

Stop the audio playback.

## port.flush()

Discard all previously written data.

# install

With [npm](https://npmjs.org) do:

```
npm install webaudio-serial-tx
```

# license

MIT
