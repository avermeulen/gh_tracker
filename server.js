var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var DatabaseSetup = require('./db-setup');
var Promise = require('bluebird');

var UpdateDetails = require('./update-details');
var GithubProcessor = require('./github-processor');
var githubProcessor = null;

//var trackUsers  =  Promise.promisifyAll(require('./track'));
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var logger=require('./log.js'); 

new DatabaseSetup(app);

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(function (req, res, next) {
  	
  	if (githubProcessor === null){
  		req.getConnection(function(err, connection){
  			githubProcessor = new GithubProcessor(new UpdateDetails(connection, io));
  			next();
  		});
  	}
  	else
  		next();
});

var getCoderData = function (connection, cb) {
	var coderSql = "select firstname as firstName, lastname as lastName, username, coder_id, min(datediff(date(now()), date(created_at))) active_days_ago from events, coders where coders.id = events.coder_id  group by coder_id order by active_days_ago;";
	connection.query(coderSql, {}, cb);
};

app.get('/', function(req, res, next){
	req.getConnection(function(err, connection){
		getCoderData(connection, function(err, coders){
			if (err){
				return next(err);
			}
			res.render('coders', {coders : JSON.stringify(coders)})
		});
	});
});

app.get('/api/coders', function (req, res) {
	
	req.getConnection(function(err, connection){
		getCoderData(connection, function(err, coders){
			if (err){
				logger.error(err);
				//return next
				return res.send({});
			}
			res.send(coders);
		});
	});
	
});

app.post('/api/coders', function(req, res, next){
	
	console.log("coder data : " + JSON.stringify(req.body));

	var userDetails = {
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		username : req.body.username,
		//status : 'requested'
	};
    
	req.getConnection(function(err, connection){
		connection.query("select * from coders where username = ?", [userDetails.username], function(err, coder){
	        if (coder && coder.length == 0){
	            connection.query("insert into coders set ?", userDetails, 
	            function(err, coder){
	            	if (err){
	                	logger.info(err);
	                	io.emit('error', {error : err});
						return;
	            	}
	                io.emit('coder_added', {data : userDetails});
	            });
	        }
	        else{
				logger.error('coder already exists!');
	            io.emit('coder_exists', {data : userDetails})
	        }
			
			githubProcessor.events(userDetails.username);
			res.send({done : true});
    	});
	});
	
});

app.get('/api/coders/refresh', function (req, res) {
	req.getConnection(function(err, connection){
		//
		connection.query("select username from coders", [], function (err, coders) {
			coders.forEach(function (coder) {
				githubProcessor.events(coder.username);
			});
			res.send({coders : coders.length});
		});
		//
	});
});

var port = process.env.GH_TRACKER_PORT || 3000;
var server = http.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  logger.log('info', 'starting up...');
  console.log('Example app listening at http://%s:%s', host, port)

})
