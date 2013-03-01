function DataSink() {
}
DataSink.prototype.send = function(data) {
  console.log("DataSink: " + JSON.stringify(data));
};

DataSink.prototype.check = function(data) {
  return true;
};

DataSink.prototype.onDisconnect = function() {
// nothing to dy by default
};

module.exports = DataSink;

DataSink.isSink = exports.isSink = function(object) {
  while (object != null) {
    if (object == DataSink.prototype)
      return true;
    object = object.__proto__;
  }
  return false;
};
