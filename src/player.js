/**
 * Child process for playing mp3 files
 * @author mtownsend
 * @since April 2019
 */

const { Readable } = require('stream');
const { createReadStream } = require('fs');
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

function start(path, loop) {
  if (speaker != null || stream != null) {
    // Can't reuse players
    return;
  }

  console.log(`${loop ? 'looping' : 'playing'} ${path}`);

  function play() {
    speaker = new Speaker(audioOptions);
    speaker.on('flush', () => process.send({ type: 'end' }));
    stream = loop ? createLoopingStream(path) : createReadStream(path);
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
  
  try {
    speaker.close();
  }
  catch(e) {
    console.log(`Couldn't close the speaker. ${e}`);
  }

  try {
    stream.close();
  }
  catch(e) {
    console.log(`Couldn't close the stream. ${e}`);
  }
}

process.on('message', ({ type, ...args }) => { 
  switch (type) {
    case 'play':
      return start(args.path, args.loop);
    case 'stop':
      return stop();
  }
});

/**
 * A ReadableStream that never ends! This provides seamless audio
 * looping when piped to a speaker. 
 */
function createLoopingStream(absolutePath) {

  const loopStream = new Readable({
    read(s) {
      // Ready for more data
      currentStream.resume();
    }
  });
  loopStream.close = () => {
    currentStream.close();
  }

  let currentStream;
  (function attachNewStream() {
    currentStream = createReadStream(absolutePath);
    // Dump the data from the regular ReadStream into our weird one.
    currentStream.on('data', chunk => {
      const canPushMore = loopStream.push(chunk);
      if (!canPushMore) {
        // Don't flood the stream
        currentStream.pause();
      }
    });
    // When the stream runs out, make a new one
    currentStream.on('end', () => {
      attachNewStream();
    });
  })();

  return loopStream;
}