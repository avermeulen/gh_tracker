var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var logger=require('./log.js');
var Coders = require('./coders');

var CoderService = require('./coder-service');
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');
var compression = require('compression');

var ConnectionProvider = require('./connection-provider');

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

var serviceSetupCallback = function(connection){

  if (!connection){
    throw Error('There is a problem with your database connection')
    return;
  }

	return {
		coderService : new CoderService(connection),
		githubProcessor : new GithubProcessor(new UpdateDetails(connection, io))
	}
};

var myConnectionProvider = new ConnectionProvider(dbOptions, serviceSetupCallback);

app.use(myConnectionProvider.setupProvider);
app.use(compression())

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
app.get('/coders', coders.allCoders);
app.post('/coders/update_term/:coder_id', coders.updateCodersTerm);

app.get('/api/coders', coders.all);
app.post('/api/coders', coders.add);
app.get('/api/coders/refresh', coders.refresh);
app.get('/api/coders/commits-per-week', coders.commitsPerWeek);
app.get('/api/coders/most-recent-commits', coders.mostRecentCommits);
app.get('/api/coders/all-recent-commits', coders.allRecentCommits);
app.get('/api/repositories/recent-activity/:days', coders.recentActiveRepositories);


var port = process.env.GH_TRACKER_PORT || 3000;
var server = http.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  logger.log('info', 'starting up...');
  console.log('Example app listening at http://%s:%s', host, port)

})
