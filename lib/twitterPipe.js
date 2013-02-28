var VERSION = '0.0.1',
  twitterClient = require('ntwitter'),
  SinkDef = require('./dataSink');

function TwitterPipe(twitterCredentials) {
  if (!(this instanceof TwitterPipe)) return new TwitterPipe(twitterCredentials);

  this.ntwitter = new twitterClient(twitterCredentials);
  this.dataSinks = [];
}

TwitterPipe.prototype.add = function(dataSink) {
  if(SinkDef.isSink(dataSink)) {
    this.dataSinks.push(dataSink);
  }
};

TwitterPipe.prototype.init = function(twitterResource, twitterParam, error) {
  if(!twitterResource) {
    twitterResource = 'statuses/filter';
  }
  if(!(typeof twitterParam === 'string')) {
    twitterParam = { 'track' : [ twitterParam ] },
  }
  
  if(!(error && typeof error === 'function')) {
    error = function (err, data) { console.log(data); };
  }
  
  var dataSinks = this.dataSinks;
  this.ntwitter
    .verifyCredentials(error)
    .stream(
      twitterResource,
      twitterParam,
      function(stream) {
        stream.on('data', function (data) {
            if(data != undefined) {
              if(data.disconnect) {
                error('disconnected' , data);
                // TODO reconnect?
              } else {
                for (var i = 0; i < dataSinks.length; i++) {
                  if(dataSinks[i].check(data)) {
                    // write data to data sink
                    dataSinks[i].send(data);
                  }
                }
              }
            }
          });
      });
};

TwitterPipe.VERSION = VERSION;
module.exports = TwitterPipe;