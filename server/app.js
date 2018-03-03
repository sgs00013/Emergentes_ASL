
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser=require("body-parser");
var app = express();
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'SD2COMH4TJHOEWNCSJGEBJOFBTAPFQX3'});
const {interactive} = require('node-wit');

app.use(bodyParser.json());
app.set("view engine", "ejs");
console.log("Programa ejecutado");

function responseBot(intent){
	var msg;
	switch(msg)
	{
		case "acc":
			msg = "Dirígete a cuenta";
		break;
		
		case "recordar":
			msg = "Acuerdate";
		break;
		
		case "upload":
			msg = "Subir la aplicación";
		break;
			
		case "error":
			msg = "No te entiendo";
		break;
	}
	return msg;
}

function getValue(data){
	var content = JSON.stringify(data);
	var msg = JSON.parse(content);
	
	if(msg.hasOwnProperty('entities'))
		return "error";
	else
		return (msg.entities.intent[0].value);
}


app.get("/practica0", function (req,res){
	res.render("index",{challenge:req.query['hub.challenge']});
}).listen(80);

app.post("/practica0" , function (req,res){
var input = req.body;
var sender_id = input.entry[0].messaging[0].sender.id;
var message = input.entry[0].messaging[0].message.text;	

client.message(message, {})
.then((data) => {
  console.log(JSON.stringify(data));
  var intent = getValue(data);
  var msg = responseBot(intent);
  console.log(msg);
})
.catch(console.error);

var response={"recipient": {"id": sender_id},"message": {"text": 'Echo: '+msg}};
var url='https://graph.facebook.com/v2.6/me/messages?access_token='+access_token;
requestify.post(url,response).then(function(response) {});

}).listen(80); //¿Puerto?





