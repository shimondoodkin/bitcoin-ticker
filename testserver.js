var d=new Date().toString();
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World '+d+'\n');
}).listen(3333);
console.log('Server running at http://127.0.0.1:3333/');
