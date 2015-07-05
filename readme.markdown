# webaudio-serial-tx

transmit serial data over webaudio in the browser

[view a demo](https://be4556806ffc934b6296846745f93e15d04660e7.htmlb.in/)

# example

``` js
var serial = require('webaudio-serial-tx');
var port = serial({ baud: 300 });

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

## port.write(buf)

Pack `buf` and send over the wire.

## port.start()

Start the audio playback.

## port.stop()

Stop the audio playback.

# install

With [npm](https://npmjs.org) do:

```
npm install webaudio-serial-tx
```

# license

MIT