var http = require("http");
var https = require("https");
var request = require("request");
var express = require('express');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var Bot = require('messenger-bot')
var app = express();

var parseString = require('xml2js').parseString;

var list_deputies = [];
var deputies_JSON = {};

var name = encodeURI("Antônio");
console.log(name);

var conversation = new ConversationV1({
	username: 'e5f411c6-1d5d-4d30-825c-8f613f94737f',
	password: 'D4aswgaZjC8Q',
	version_date: ConversationV1.VERSION_DATE_2017_02_03
});


var bot = new Bot({
	token: 'EAAauMlcKvcYBACSVtLiZBPPd8jnsQmaR9kpwRQZCpzVxZAyGhGVY55iw4dCpnr0TzTZAXgzE5FDC7f1F47384q1uePZBFvpNCZCgxToGUPsTGSw2bPWvk1O40NvGFq0XZAiScN9wlR7yFVFNyHQELNl15pj9hx8alaD8NET9s1ObQZDZD',
	verify: 'capiva123',
	app_secret: '655dc5cf75313d4fc3a76e1f2f080b46'
});

bot.on('error',function(err){
	console.log(err.message)
});

Context = {}

bot.on('message', function(payload, reply){
	var text = payload.message.text;
	id = payload.sender.id;
	Context[id] = Context[id] || {};

	conversation.message({
		input: { text: text },
		workspace_id: '37dbfdf9-2b69-4eee-a446-5e436921c376'
	}, function(err, response) {
		if (err) {
			console.error(err);
		} else {
			reply({ response }, function(err) {
				console.log(err);
			})
		}
	});


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
