var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var logger=require('./log.js'); 
var Coders = require('./coders');

//setup socket io
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var dbOptions = {
      host: 'localhost',
      user: 'gh',
      password: 'password',
      port: 3306,
      database: 'gh_tracker'
};
app.use(myConnection(mysql, dbOptions, 'pool'));
//
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));

var coders = new Coders(io);
app.get('/', coders.list);

-app.get('/api/coders', coders.all);
app.post('/api/coders', coders.add);
app.get('/api/coders/refresh', coders.refresh);

var port = process.env.GH_TRACKER_PORT || 3000;
var server = http.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  logger.log('info', 'starting up...');
  console.log('Example app listening at http://%s:%s', host, port)

})
