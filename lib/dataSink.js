function DataSink() {
}
DataSink.prototype.send = function(data) {
  console.log("DataSink: " + JSON.stringify(data));
};

DataSink.prototype.check = function(data) {
  return true;
};

module.exports = DataSink;

exports.isSink = function(object) {
  while (object != null) {
    if (object == DataSink.prototype)
      return true;
    object = object.__proto__;
  }
  return false;
};