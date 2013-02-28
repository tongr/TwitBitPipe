var SinkDef = require('./dataSink'),
    fs = require('fs');
  
//i.e. require('./config')
function FileSink(config) {
  if (!(this instanceof FileSink)) return new FileSink(config);
  
  this.config = config;
  this.chunkSize = 0;
  this.outStream = undefined;
}

FileSink.prototype = new SinkDef();

FileSink.prototype.dateString = function() {
  return new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
};

FileSink.prototype.closeStream = function() {
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
  this.outStream.on('error', function (err) {
    console.log(err);
    _this.openStream();
  });
};

FileSink.prototype.write = function(data) {
  if( this.outStream == undefined || ++this.chunkSize > this.config.maxChunkSize ) {
    this.openStream();
  }
  // write data to file if check is successful
  if(this.check(data)) {
    // TODO handle stream drains?
    this.outStream.write( JSON.stringify( data ) + '\n', 'utf8');
  }
};

FileSink.prototype.send = FileSink.prototype.write;

module.exports = FileSink;