var 
  twitterCredentials = require('./twitter.credentials.private'),
  rabbitSettings = require('./rabbitmq.config.private'),
  Pipe = require('./lib/pipe');

var pipeInstance = new Pipe(twitterCredentials, rabbitSettings);

// filter all tweets containing links and pipe it to the linkTweets exchange
pipeInstance.filter(
  'statuses/filter', 
  { 'track' : ['http'] }, 
  'linkTweets');
