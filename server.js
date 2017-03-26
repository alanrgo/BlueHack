
var http = require("http");
var https = require("https");
var request = require("request");
var express = require('express');
var app = express();
var parseString = require('xml2js').parseString;

var list_deputies = [];
var deputies_JSON = {};

var name = encodeURI("Antônio");
console.log(name);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

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








