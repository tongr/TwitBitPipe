var 
  twitterCredentials = require('./twitter.credentials.private'),
  Source = require('./lib/twitterPipe'),
  rabbitSettings = require('./rabbitmq.config.private'),
  RabbitSink = require('./lib/rabbitSink'),
  fileConfig = require('./fileSink.config'),
  FileSink = require('./lib/fileSink');

var pipeInstance = new Source(twitterCredentials);

// add file pipe
var fileOut = new FileSink(fileConfig);
pipeInstance.add(fileOut);


/*
pipeInstance.init('statuses/filter', { 'track' : ['http'] });
/*/
//add rabbit sink
var rabbitOut = new RabbitSink(rabbitSettings);
pipeInstance.add(rabbitOut);

// init the rabbit connection ..
// after connection to rabbit was established, start twitter streaming api access
rabbitOut.init({
    name : 'tweets',
    type : 'fanout',
    durable : false,
    exclusive : false,
    autoDelete : true,
    content : {
      contentEncoding : 'utf8', 
      contentType : 'application/json'
	}
  }, function() {
    // filter all tweets containing links and pipe it to the previously defined file sinks
    pipeInstance.init('statuses/filter', { 'track' : ['http'] });
  }
);
//*/
