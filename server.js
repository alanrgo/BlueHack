var http = require("http");
var https = require("https");
var request = require("request");
var express = require('express');
var app = express();
var http = require('http')
var Bot = require('messenger-bot')

var bot = new Bot({
  token: 'EAAauMlcKvcYBACSVtLiZBPPd8jnsQmaR9kpwRQZCpzVxZAyGhGVY55iw4dCpnr0TzTZAXgzE5FDC7f1F47384q1uePZBFvpNCZCgxToGUPsTGSw2bPWvk1O40NvGFq0XZAiScN9wlR7yFVFNyHQELNl15pj9hx8alaD8NET9s1ObQZDZD',
  verify: 'capiva123',
  app_secret: '655dc5cf75313d4fc3a76e1f2f080b46'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  var text = payload.message.text

  bot.getProfile(payload.sender.id, function(err, profile){

    reply({ text }, function(err) {

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

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

var port = process.env.PORT || 3000
app.listen(port, function() {
        console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
