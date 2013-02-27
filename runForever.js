// this script requires the forever-monitor module
var forever = require('forever-monitor');

var pipe = new (forever.Monitor)('run.js', {
  silent: true,
  options: []
});

pipe.on('error', function (err) {
  console.error('error in pipe: ' + JSON.stringify(err));
});

pipe.on('exit', function (forever) {
  console.error('Alert! pipe exists (permanently)');
});

pipe.on('restart', function (forever) {
  console.warn('pipe is restarted');
});

pipe.on('stderr', function (data) {
  console.warn('pipe is reporting an error: ' + JSON.stringify(data));
});

pipe.on('start', function (process, data) {
  console.info('pipe was started: ' + JSON.stringify(data));
});

//pipe.on('stdout', function (data) {
//  console.info('pipe reports: ' + JSON.stringify(data));
//});

pipe.on('stop', function (process) {
  console.info('pipe was stopped by he user');
});

pipe.start();