var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic('prime_numbers')).listen(8080);