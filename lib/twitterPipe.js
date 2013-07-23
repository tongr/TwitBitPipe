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


TwitterPipe.connect = function(ntwitter, twitterResource, twitterParam, dataSinks, error) {
  ntwitter
    .verifyCredentials(function (err, data) { 
        if( err && err !== null ) {
          error(err, data)
        } else {
          console.log('connection established' + ((data && data.screen_name)?' (w/ screen_name: ' + data.screen_name + ')':'') + '!'); 
        }
      })
	.stream(
      'statuses/filter',
      twitterParam, //{ 'track' : ['http'] },
      function(stream) {
        stream.on('data', function (data) {
            if(data != undefined) {
              if(data.disconnect) {
			    // log disconnect
                error('disconnected' , data);
				
                // forward disconnect state
                for (var i = 0; i < dataSinks.length; i++) {
                  dataSinks[i].onDisconnect();
                }
				
				// reconnect
                TwitterPipe.connect(ntwitter, twitterResource, twitterParam, dataSinks, error);
              } else {
                if(data.limit) {
                  error('data limit reached' , data);
                }
                for (var i = 0; i < dataSinks.length; i++) {
                  if(dataSinks[i].check(data)) {
                    // write data to data sink
                    dataSinks[i].send(data);
                  }
                }
              }
            }
          });
          stream.on('error', function(data) {
            error('twitter stream error', data);
          });
      });
};

TwitterPipe.prototype.init = function(twitterResource, twitterParam, error) {
  if(!twitterResource) {
    twitterResource = 'statuses/filter';
  }
  if( twitterParam == undefined || twitterParam == null ) {
    twitterParam = { 'track' : ['http'] };
  } else if( typeof twitterParam === 'string' ) {
    twitterParam = { 'track' : [ twitterParam ] };
  }
  
  
  if(!(error && typeof error === 'function')) {
    error = function (err, data) { 
      console.log('error occured (' + err + '): ');
      console.log(data); 
    };
  }
  
//  for (var i = 0; i < this.dataSinks.length; i++) {
//    console.log(' ... sink' + (i+1));
//  }
  TwitterPipe.connect(this.ntwitter, twitterResource, twitterParam, this.dataSinks, error);
};



TwitterPipe.VERSION = VERSION;
module.exports = TwitterPipe;
