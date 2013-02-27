var SinkDef = require('./dataSink');

function RabbitSink(rabbitSettings) {
  if (!(this instanceof RabbitSink)) return new RabbitSink(rabbitSettings);
  
  // TODO add amqp -> rabbitSettings
  this.rabbit = {};
}

RabbitSink.prototype = new SinkDef();

RabbitSink.prototype.send = function(data) {
  if(this.check(data)) {
    // TODO send data to amqp
  }
};

module.exports = RabbitSink;