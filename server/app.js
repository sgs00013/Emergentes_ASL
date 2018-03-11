
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var requestify = require('requestify');

//Datos de Wit.ai
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'SD2COMH4TJHOEWNCSJGEBJOFBTAPFQX3'});

//Datos de Facebook
var acces_token='EAAGOL5D1Yc0BANRBaEZAKGLNmnDJMYZCimfQR93wwD8XEBdFzR3y0hxFiAuagWicXuuu9pcZBZBldwgcEvdaRhqwLprCVFxzMB4ChZCgOFXm9VEnVxXpO5N8EWLDxhU8V6A8f2rbBWmKmo6n3wXuRmbtMeph31Gs7WHr3dfBQmU3QA9T9jKZCF';
var url='https://graph.facebook.com/v2.6/me/messages?access_token='+acces_token;


app.use(bodyParser.json());
app.use(express.static('public'));
app.set("view engine", "ejs");

function responseBot(intent){
	var msg;
	console.log(intent);
	switch(intent)
	{
		case "acc":
			msg = "Diríjase a la parte superior izquierda y pulse en Log up";
		break;
		
		case "recordar":
			msg = "En el menú inicial pulse la opción de recuperar cuenta";
		break;
		
		case "upload":
			msg = "Vaya a la pestaña Upload app y dale click a Subir aplicación";
		break;
			
		default:
			msg = "No te entiendo, expliquemelo de otra forma";
	}
	return msg;
}

function getValue(data){
	var content = JSON.stringify(data);
	var msg = JSON.parse(content);
	console.log(msg);
	
	if(!msg.entities.hasOwnProperty('intent'))
		return "error";
	else
		return (msg.entities.intent[0].value);
}


app.get("/practica", function (req,res){
	res.render("index",{challenge:req.query['hub.challenge']});
	console.log("Verificacion del challenge");
});

app.post("/practica", function (req,res){
var input = req.body;
if (input.entry[0].messaging[0].message != ' '){
	var sender_id = input.entry[0].messaging[0].sender.id;
	var message = input.entry[0].messaging[0].message.text;

client.message(message, {})
.then((data) => {
  console.log(JSON.stringify(data));
  var intent = getValue(data);
  var msg = responseBot(intent);
  var response={"recipient": {"id": sender_id},"message": {"text": 'Echo: '+msg}};
  requestify.post(url,response).then(function(response) {});
});


res.render("index",{challenge: {status:200}});
}

});

app.listen(80);





