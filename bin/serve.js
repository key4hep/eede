import express from 'express';

var app = express();

app.get('/', function(req, res) {
  res.redirect('index.html')
});

app.use(express.static('.'));

const server = app.listen(8008, "127.0.0.1", function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Serving from: http://' + host + ':' + port + '/');
});
