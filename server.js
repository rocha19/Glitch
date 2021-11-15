// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const mysql = require("mysql");

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/contatos', function(request, response) {

  var connection = mysql.createConnection({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB  
  });
  connection.connect();
  
  var intentName = request.body.queryResult.intent.displayName;
  
  if (intentName == 'incluir.contatos') {
    console.log('incluir')  
    
    var numero_contato = request.body.queryResult.parameters['numero-contato'];
    var nome_contato   = request.body.queryResult.parameters['nome-contato'];
    var email_contato  = request.body.queryResult.parameters['email-contato'];
    
    var query = 'insert into contato values ("'+numero_contato+'","'+nome_contato+'","'+email_contato+'")';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       connection.end();
       response.json({"fulfillmentText" :"Contato Inserido com Sucesso" })
    }); 
  
    
  } else if (intentName == 'atualizar.contatos') {
    console.log('atualizar')
    
    var numero_contato = request.body.queryResult.parameters['numero-contato'];

    var query = 'select * from contato where telefone = "'+numero_contato+'"';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       connection.end();
       response.json({"fulfillmentText" :"Quer Alterar - "+results[0].nome+"-"+results[0].email })
    }); 
    
  } else if (intentName == 'apagar.contatos') {
    console.log('apagar')
    
    var numero_contato = request.body.queryResult.parameters['numero-contato'];       
    var query = 'delete from contato where telefone = "'+numero_contato+'"';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       connection.end();
       response.json({"fulfillmentText" :"Contato Apagado com Sucesso" })
    }); 
    
  } else if (intentName == 'pesquisar.contatos') {
    console.log('pesquisar')
    
    var nome_contato   = request.body.queryResult.parameters['nome-contato'];
    var query = 'select * from contatos where nome = "'+nome_contato+'"';
    
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       connection.end();
       var contato =  '';
       contato = 'Numero =>'+results[0].telefone+'- Nome =>'+results[0].nome+'-Email =>'+results[0].email;
       response.json({"fulfillmentText" : contato })
    }) ;
  } else if (intentName == 'atualizar.contatos - yes')  {
    console.log("atualizar-yes");
    
    var numero_contato = request.body.queryResult.outputContexts[0].parameters['numero-contato'];
    var nome_contato   = request.body.queryResult.parameters['nome-contato'];
    var email_contato  = request.body.queryResult.parameters['email-contato'];
    
    var query = 'update contato set nome = "'+nome_contato+'",email = "'+email_contato+'" where telefone = "'+numero_contato+'"';
   
    connection.query(query, function (error, results, fields) {
       if (error) throw error;
       connection.end();
       response.json({"fulfillmentText" :"Contato Alterado" })
    }); 
    
  }
 
  
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
