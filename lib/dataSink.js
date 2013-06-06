function DataSink() {
}
DataSink.prototype.send = function(data) {
  console.log("DataSink: " + JSON.stringify(data));
};


DataSink.prototype.filter = null;

DataSink.prototype.check = function(data) {
  if( this.filter != null ) {
    for (var key in this.filter) {
      var actual = data[key];
      var expected = this.filter[key];
      var reject = true;
      for (var i=0;i<expected.length;i++) {
        if( actual == expected[i] ) {
          reject = false;
          break;
        }
      }
      if(reject) {
        return false;
      }
    }
  }
  
  return true;
};

DataSink.prototype.setFilter = function(filters) {
  if( filters != null && filters != undefined && 'object' == typeof filters ) {
    for (var key in filters) {
      if ( !( filters[key] instanceof Array ) ) {
        filters[key] = [ filters[key] ];
      }
    }
    this.filter = filters;
  }
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
