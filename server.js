const http = require('http');
http.createServer((res , req) => {
  req.write('online');
  req.end();
}).listen(8080);