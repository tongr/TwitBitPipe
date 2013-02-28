var amqp = require('amqp'),
  SinkDef = require('./dataSink');

function RabbitSink(serverSettings) {
  if (!(this instanceof RabbitSink)) return new RabbitSink(rabbitSettings);
  
  this.connection = null;
  this.exchange = null;
  this.serverSettings = serverSettings;
}

RabbitSink.prototype = new SinkDef();


// the opt parameter might contain
// - type 'fanout', 'direct', or 'topic' (default)
// - passive (boolean)
// - durable (boolean)
// - autoDelete (boolean, default true)
// - the content field might contain
//  - mandatory (boolean, default false)
//  - immediate (boolean, default false)
//  - contentType (default 'application/octet-stream')
//  - contentEncoding
//  - headers
//  - deliveryMode
//  - priority (0-9)
//  - correlationId
//  - replyTo
//  - experation
//  - messageId
//  - timestamp
//  - userId
//  - appId
//  - clusterId
// 
// default:
// opt = {
//   name : 'tweets',
//   type : 'fanout',
//   durable : true,
//   exclusive : false,
//   autoDelete : true,
//   content : {
//     contentEncoding : 'utf8', 
//     contentType : 'application/json'
//   }
// };
RabbitSink.prototype.init = function(opt, callback, err) {
// set default opt parameters
  if(opt) {
    if(typeof opt === 'function') {
      err = callback;
      callback = opt;
	  opt = {};
    } if(typeof opt !== 'object') {
	   opt = {};
	}
  } else {
    opt = {};
  }
  opt.name = opt.name || 'tweets';
  opt.type = opt.type || 'fanout';
  opt.durable = opt.durable || true;
  opt.exclusive = opt.exclusive || false;
  opt.autoDelete = opt.autoDelete || true;
  opt.content = opt.content || {};
  opt.content.contentEncoding = opt.content.contentEncoding || 'utf8';
  opt.content.contentType = opt.content.contentType || 'application/json';
  

  var _this = this;
  var exchangeOptions = opt;
  this.sendOptions = opt.content;
  this.connection = amqp.createConnection(this.serverSettings);
  
  //console.log('connection created');
  if(err) {
    this.connection.on('error', err);
  }
  
  // Wait for connection to become established.
  this.connection.on('ready', function () {
  // Use the default exchange
    _this.connection.exchange(exchangeOptions.name, exchangeOptions, function(ex){
      _this.exchange = ex;
      callback();
    });
  });
};


RabbitSink.prototype.close = function() {
  if(this.connection !== null) {
    this.exchange = null;
    this.connection.end();
    this.connection = null;
  }
};

RabbitSink.prototype.send = function(data) {
  if(this.exchange===null) {
    console.error('exchange not yet initialized! please run "RabbitSink.init()" first');
    return;
  }
  if(this.check(data)) {
    // send data to amqp
    this.exchange.publish('#', data, this.sendOptions);
  }
};

module.exports = RabbitSink;