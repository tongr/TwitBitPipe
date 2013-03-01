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
RabbitSink.prototype.init = function(opt, callback, error) {
  // set default opt parameters
  if(opt) {
    if(typeof opt === 'function') {
      error = callback;
      callback = opt;
      opt = {};
    } if(typeof opt !== 'object') {
       opt = {};
    }
  } else {
    opt = {};
  }
  if(!(error && typeof error === 'function')) {
    error = function (err, data) { 
      console.log('error occured (' + err + '): ');
      console.log(data); 
    };
  }
  opt.name = opt.name || 'tweets';
  opt.type = opt.type || 'fanout';
  opt.durable = opt.durable || true;
  opt.exclusive = opt.exclusive || false;
  opt.autoDelete = opt.autoDelete || true;
  opt.content = opt.content || {};
  opt.content.contentEncoding = opt.content.contentEncoding || 'utf8';
  opt.content.contentType = opt.content.contentType || 'application/json';
  

  this.exchangeOptions = opt;
  this.error = error;
  
  // close old conneciton
  this.close();
  
  // create new connection
  this.connect(callback);
};

RabbitSink.prototype.connect = function(callback) {
  this.connection = amqp.createConnection(this.serverSettings);
  
  //console.log('connection created');
  if(this.error) {
    this.connection.on('error', this.error);
  }
  
  var _this = this;
  // wait for connection to become established.
  this.connection.on('ready', function () {
    // create the exchange
    _this.connection.exchange(_this.exchangeOptions.name, _this.exchangeOptions, function(ex){
      _this.exchange = ex;
	  if(callback) {
        callback();
      }
    });
  });
};

// handle disconnect events (twitter source) by disconnecting from and enable a reconnect to rabbit later on
RabbitSink.prototype.onDisconnect = function() {
  this.close();
};

RabbitSink.prototype.close = function() {
  if(this.connection !== null) {
    this.exchange = null;
    this.connection.end();
    this.connection = null;
  }
};

RabbitSink.prototype.send = function(data, noReconnect) {
  if(this.exchange===null) {
    if (noReconnect) {
      this.error('exchange not yet initialized! please run "RabbitSink.init()" first');
      return;
	}
	// try reconnecting (only once)
	var _this = this;
	console.log('Trying to (re-)connect to RabbitMQ ...');
	this.connect(function() {
	  _this.send(data, true);
	});
  }
  // send data to amqp
  this.exchange.publish('#', data, this.exchangeOptions.content);
};

module.exports = RabbitSink;