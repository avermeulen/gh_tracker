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

new DatabaseSetup(app);

//var githubProcessor = new GithubProcessor();

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

app.get('/coders', function(req, res, next){

	req.getConnection(function(err, connection){
			
		connection.query('select * from coders', {}, function(err, coders){
			
			//console.log(arguments);

			if (err)
				return next(err);

			res.render('coders', {coders : JSON.stringify(coders)})
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
	                	console.log(err);
	                	io.emit('error', {error : err});
	            	}
	            	else{
	                	console.log(coder);	
	                	io.emit('coder_added', {data : userDetails});
	            	}
	            });
	        }
	        else{
	            //cb(err, null);
				console.log('coder already exists!');
	            io.emit('coder_exists', {data : userDetails})
	        }
			githubProcessor.events(userDetails.username);
    	});
	});
	
});


var server = http.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
