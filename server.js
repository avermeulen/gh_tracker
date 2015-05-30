var express = require('express')
var exphbs  = require('express-handlebars')
var app = express()
var bodyParser = require('body-parser')
var DatabaseSetup = require('./db-setup')
var Promise = require('bluebird');

var trackUsers  =  Promise.promisifyAll(require('./track'));

var http = require('http').Server(app);
var io = require('socket.io').listen(http);

new DatabaseSetup(app)

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

var dao = {
	list : function(connection, query, params, cb){
		connection.query(query, params, cb)
	}
};

dao = Promise.promisifyAll(dao);


app.get('/coders', function(req, res, next){

	req.getConnection(function(err, connection){
			
		connection.query('select * from coders', {}, function(err, coders){
			
			//console.log(arguments);

			if (err)
				return next(err)

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
			//console.log(coder);
	        if (coder && coder.length == 0){
	            connection.query("insert into coders set ?", userDetails, 
	            function(err, coder){
	            	if (err){
	                	console.log(err);
	                	io.emit('error', {error : err});
	            	}
	            	else{
	                	console.log(coder);
	                	//cb(null, coder)
	                	io.emit('coder_added', {data : userDetails});
	            	}
	            });
	        }
	        else{
	            //cb(err, null);
				console.log('coder already exists!');
	            io.emit('coder_exists', {data : userDetails})
	        }
    	});
	});

	/*
	trackUsers
		.trackUserAsync(userData)
		.then(function (userRepoInfo) {

			console.log("coder added")
			io.emit('coder_added', {data : userRepoInfo});

		})
		.catch(function (err) {
			console.log("err : " + err);
		});
	*/

	/**

	req.getConnection(function(err, connection){
		if (err)
			return next(err)

		connection.query('insert into coders set ?', data, function(err, result){
			if (err){
				return next(err)
			}
			else{
				
				res.redirect('/coders')
			}
		});

	});
	*/
	
	//res.render('coders', coders);
});


var server = http.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
