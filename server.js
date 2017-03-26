var http = require("http");
var https = require("https");
var request = require("request");
var express = require('express');
var Bot = require('messenger-bot')
var app = express();

var parseString = require('xml2js').parseString;

var list_deputies = [];
var deputies_JSON = {};

var name = encodeURI("Antônio");
console.log(name);



var bot = new Bot({
    token: 'EAAauMlcKvcYBACSVtLiZBPPd8jnsQmaR9kpwRQZCpzVxZAyGhGVY55iw4dCpnr0TzTZAXgzE5FDC7f1F47384q1uePZBFvpNCZCgxToGUPsTGSw2bPWvk1O40NvGFq0XZAiScN9wlR7yFVFNyHQELNl15pj9hx8alaD8NET9s1ObQZDZD',
    verify: 'capiva123',
    app_secret: '655dc5cf75313d4fc3a76e1f2f080b46'
});

bot.on('error',function(err){
    console.log(err.message)
});

bot.on('message', function(payload, reply){
    var text = payload.message.text;

    bot.getProfile(payload.sender.id, function(err, profile){

        reply({ text }, function(err) {

            console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        })
    })
});


var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return bot._verify(req, res);
})

app.post('/', (req, res) => {
  bot._handleMessage(req.body)
  res.end(JSON.stringify({status: 'ok'}))
})

http.createServer(app).listen(port);
console.log('Echo bot server running at port 3000.')

app.get('/procurar-todos', function (req, res){
	list_deputies = [];
	if( Object.keys(deputies_JSON).length == 0 ){
		request({
			uri: "http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDeputados",
			method: "GET",
			timeout: 10000,
			followRedirect: true,
			maxRedirects: 10
		}, function(error, response, body) {
			var xml = body;
			parseString(xml, function (err, result) {
				list_deputies = [];
				deputies_JSON = result;
			  	// console.dir(result.deputados.deputado[0]);
			  	result.deputados.deputado.forEach(function (item, index){
			  		console.log(item.nome[0]);
			  		list_deputies.push(item.nome[0]);

			  	});
			});  
		});
		res.send(deputies_JSON);
	}
	else{
		res.send(deputies_JSON);
	}
	
});

app.get('/get-email/:id', function(req, res){
	list_deputies = [];
	if( Object.keys(deputies_JSON).length == 0 ){
		request({
			uri: "http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDeputados",
			method: "GET",
			timeout: 10000,
			followRedirect: true,
			maxRedirects: 10
		}, function(error, response, body) {
			var xml = body;
			parseString(xml, function (err, result) {
			  	// console.dir(result.deputados.deputado[0]);
			  	deputies_JSON = result;
			  	result.deputados.deputado.forEach(function (item, index){
			  		list_deputies.push(item.nome[0]);
			  		if( item.ideCadastro[0] == req.params.id){
			  			console.log(item.email[0]);
			  		}
			  	});
			  	res.send(list_deputies);
			});
		});
	}
	else {
		deputies_JSON.deputados.deputado.forEach(function (item, index){
	  		list_deputies.push(item.nome[0]);
	  		if( item.ideCadastro[0] == req.params.id){
	  			console.log(item.email[0]);
	  		}
	  	});
	  	res.send(list_deputies);
	}
});

app.get('/get-email-by-name/:name', function( req, res){
	//Ant%C3%B4nio
	list_deputies = [];
	if( Object.keys(deputies_JSON).length == 0 ){
		request({
			uri: "http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDeputados",
			method: "GET",
			timeout: 10000,
			followRedirect: true,
			maxRedirects: 10
		}, function(error, response, body) {
			var xml = body;
			parseString(xml, function (err, result) {
			  	// console.dir(result.deputados.deputado[0]);
			  	deputies_JSON = result;

			  	result.deputados.deputado.forEach(function (item, index){
			  		if( item.nome[0].toLowerCase().indexOf(req.params.name.toLowerCase()) !== -1 ){
			  			list_deputies.push([item.nome[0], item.email[0]]);
			  		}
			  	});
			  	res.send(list_deputies);
			});
		});
	}
	else {
		deputies_JSON.deputados.deputado.forEach(function (item, index){
			if( item.nome[0].toLowerCase().indexOf(req.params.name.toLowerCase()) !== -1 ){
	  			list_deputies.push([item.nome[0], item.email[0]]);
	  		}
	  	});
	  	res.send(list_deputies);
	}

});
