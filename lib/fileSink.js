var SinkDef = require('./dataSink'),
    fs = require('fs');

function FileSink(config, error) {
  if (!(this instanceof FileSink)) return new FileSink(config);
  
  if(!(error && typeof error === 'function')) {
    error = function (err, data) { 
      console.log('error occured (' + err + '): ');
      console.log(data); 
    };
  }
  
  this.error = error;
  this.config = config;
  this.chunkSize = 0;
  this.outStream = undefined;
}

FileSink.prototype = new SinkDef();

FileSink.prototype.dateString = function() {
  return new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
};

FileSink.prototype.onDisconnect = FileSink.prototype.closeStream = function() {
  if(this.outStream!=undefined) {
    this.outStream.end();
  }
  this.outStream = undefined;
};

FileSink.prototype.openStream = function() {
  if(this.outStream != undefined) {
    this.closeStream();
  }
  this.chunkSize = 0;
  // see answer for http://stackoverflow.com/questions/10645994/node-js-how-to-format-a-date-string-in-utc by chbrown
  var filename = this.config.outputDirectory + this.config.outputFilePrefix + this.dateString() + this.config.outputFileExtension;
  this.outStream = fs.createWriteStream(filename, { flags: 'w', encoding: 'utf8' });
  
  var _this = this;
  this.outStream.on('error', function (err, data) {
    _this.error(err, data);
    _this.openStream();
  });
};

FileSink.prototype.send = FileSink.prototype.write = function(data) {
  if( this.outStream == undefined || ++this.chunkSize > this.config.maxChunkSize ) {
    this.openStream();
  }
  // write data to file if check is successful
  if(this.check(data)) {
    // TODO handle stream drains?
    this.outStream.write( JSON.stringify( data ) + '\n', 'utf8');
  }
};

module.exports = FileSink;