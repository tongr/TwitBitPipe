var 
  twitterCredentials = require('./twitter.credentials.private'),
  rabbitSettings = require('./rabbitmq.config.private'),
  fileConfig = require('./fileSink.config'),
  Source = require('./lib/twitterPipe'),
//RabbitSink = require('./lib/rabbitSink'),
  FileSink = require('./lib/fileSink');

var pipeInstance = new Source(twitterCredentials);
var fileOut = new FileSink(fileConfig);

pipeInstance.add(fileOut);

// filter all tweets containing links and pipe it to the previously defined file sink
pipeInstance.init('statuses/filter', { 'track' : ['http'] });
