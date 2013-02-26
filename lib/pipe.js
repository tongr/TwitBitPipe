var VERSION = '0.0.1',
  twitterClient = require('ntwitter');

function Pipe(twitterCredentials) {
  if (!(this instanceof Pipe)) return new Pipe(twitterCredentials);

  this.ntwitter = new twitterClient(twitterCredentials);
  // TODO add amqp
  this.rabbit = {};
}
Pipe.VERSION = VERSION;
module.exports = Pipe;

/*
 * add a twitter stream filter and pipe it to rabbit mq
 */
Pipe.prototype.filter = function(twitterResource, twitterParam, rabbitParams, error) {
  if(!filter) {
    filter = 'statuses/filter';
  }
  if(!(typeof twitterParam === 'string')) {
    twitterParam = { 'track' : [ twitterParam ] },
  }
  if(!(typeof rabbitParams === 'string')) {
    // TODO ???
	rabbitParams = { filter : function (data) { true; }, exchange : rabbitParams }
  }
  if(!(error && typeof error === 'function')) {
    error = function (err, data) { console.log(data); };
  }
  
  this.ntwitter
    .verifyCredentials(error)
    .stream(
      'statuses/filter',
      twitterParam,
      function(stream) {
        stream.on('data', function (data) {
          if(data != undefined) {
            if(data.disconnect) {
			  error('disconnected' , data);
			  // TODO reconnect?
            } else {
			  // TODO write data to RabbitMQ
			  // implement list of conditional exchange definions -> rabbitParams = { filter : function (data) { true; }, exchange : tweets ... }
              filePipe.writeOutStream(data);
            }
          }
        });
	  }
    );
  return this;
};