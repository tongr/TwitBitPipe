var twitterClient = require('ntwitter'),
    credentials = require('../twitter.credentials.private.js'),
    fs = require('fs');

var filePipe = {
  config : require('./config'),
  // see also https://github.com/AvianFlu/ntwitter
  ntwitter : new twitterClient(credentials),
  chunkSize : 0,
  outStream : undefined
};

filePipe.closeOutStream = function() {
  if(filePipe.outStream!=undefined) {
    filePipe.outStream.end();
  }
  filePipe.outStream = undefined;
};
filePipe.currentDate = function() {
  return new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
};
filePipe.openOutStream = function() {
  if(filePipe.outStream != undefined) {
    filePipe.closeOutStream();
  }
  filePipe.chunkSize = 0;
  // see answer for http://stackoverflow.com/questions/10645994/node-js-how-to-format-a-date-string-in-utc by chbrown
  var filename = filePipe.config.outputDirectory + filePipe.config.outputFilePrefix + filePipe.currentDate() + filePipe.config.outputFileExtension;

  filePipe.outStream = fs.createWriteStream(filename, { flags: 'w', encoding: 'utf8' });
  filePipe.outStream.on('error', function (err) {
    console.log(err);
    filePipe.openOutStream();
  });
};
filePipe.writeOutStream = function(data) {
  if( filePipe.outStream == undefined || ++filePipe.chunkSize > filePipe.config.maxChunkSize ) {
    filePipe.openOutStream();
  }
  // TODO handle stream drains?
  filePipe.outStream.write( JSON.stringify( data ) + '\n', 'utf8');
};

filePipe.print = function(stream) {
  stream.on('data', function (data) {
    if(data != undefined) {
      if(data.disconnect) {
        console.error(JSON.stringify(data));
        filePipe.connect();
        filePipe.openOutStream();
      } else if(data.entities != undefined && data.entities.hashtags != undefined && data.entities.hashtags.length>0 && data.entities.urls != undefined && data.entities.urls.length>0) {
        filePipe.writeOutStream(data);
      }
    }
  });
};
filePipe.connect = function() {
  filePipe.ntwitter
    .verifyCredentials(function (err, data) { console.log(data); })
    .stream(
      'statuses/filter',
      { 'track' : ['http'] },
      filePipe.print
    );
};

filePipe.connect();