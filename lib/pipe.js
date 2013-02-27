var VERSION = '0.0.1',
  twitterClient = require('ntwitter');

function Pipe(twitterCredentials) {
  if (!(this instanceof Pipe)) return new Pipe(twitterCredentials);

  this.ntwitter = new twitterClient(twitterCredentials, rabbitSettings);
  // TODO add amqp -> rabbitSettings
  this.rabbit = {};
}
Pipe.VERSION = VERSION;
module.exports = Pipe;

/*
 * add a twitter stream filter and pipe it to rabbit mq
 */
Pipe.prototype.filter = function(twitterResource, twitterParam, rabbitParam, error) {
  if(!filter) {
    filter = 'statuses/filter';
  }
  if(!(typeof twitterParam === 'string')) {
    twitterParam = { 'track' : [ twitterParam ] },
  }
  if(!(typeof rabbitParam === 'string')) {
    // TODO ???
	rabbitParam = { filter : function (data) { true; }, exchange : rabbitParam }
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
			  // implement list of conditional exchange definions -> rabbitParam = { filter : function (data) { true; }, exchange : tweets ... }
              filePipe.writeOutStream(data);
            }
          }
        });
	  }
    );
  return this;
};