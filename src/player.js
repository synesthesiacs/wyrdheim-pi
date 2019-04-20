/**
 * Child process for playing mp3 files
 * @author mtownsend
 * @since April 2019
 */

const fs = require('fs');
const Speaker = require('speaker');
const lame = require('lame');

const audioOptions = {
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  mode: lame.STEREO
};

let speaker = null;
let stream = null;

function start(path) {
  if (speaker != null || stream != null) {
    // Can't reuse players
    return;
  }

  function play() {
    speaker = new Speaker(audioOptions);
    speaker.on('flush', () => process.send({ type: 'end' }));
    stream = fs.createReadStream(path);
    stream
      .pipe(new lame.Decoder())
      .pipe(speaker);
  }
  play();
}

function stop() {
  if (speaker == null || stream == null) {
    // What's not started may never stop
    return;
  }
  speaker.close();
  stream.close();
}

process.on('message', ({ type, ...args }) => { 
  switch (type) {
    case 'play':
      return start(args.path);
    case 'stop':
      return stop();
  }
});