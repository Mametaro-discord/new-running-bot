const http = require('http');
http.createServer((a, b) => {
  /*第2引数を使う*/ 
  b.write('demo');
  b.end();
}).listen(3000);