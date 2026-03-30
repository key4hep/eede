import express from "express";

var app = express();

app.get("/", function (req, res) {
  res.redirect("index.html");
});

app.use(express.static("."));

const server = app.listen(8008, "127.0.0.1", function () {
  const addr = server.address();
  if (!addr) {
    throw new Error(
      "Port 8008 might be in use already, try running 'kill -9 $(lsof -t -i:8008) if there no other users'",
    );
  } else {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Serving from: http://" + host + ":" + port + "/");
  }
});
