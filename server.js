
var http = require("http");
var https = require("https");
var request = require("request");
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/procurar-todos', function (){
	console.log();
});

request({
  uri: "http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDeputados",
  method: "GET",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, function(error, response, body) {
  console.log(body);
});