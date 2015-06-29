
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');

module.exports = function(io){

	var getCoderData = function (connection, cb) {
		var coderSql = "select firstname as firstName, lastname as lastName, username, coder_id, min(datediff(date(now()), date(created_at))) active_days_ago from events, coders where coders.id = events.coder_id  group by coder_id order by active_days_ago;";
		connection.query(coderSql, {}, cb);
	};

	this.list = function(req, res, next){
		req.getConnection(function(err, connection){
			getCoderData(connection, function(err, coders){
				if (err){
					logger.error(err.stack);
					return next(err);
				}
				res.render('coders', {coders : JSON.stringify(coders)})
			});
		});
	};

	this.all = function(req, res, next){
		req.getConnection(function(err, connection){
			getCoderData(connection, function(err, coders){
				if (err){
					logger.error(err.stack);
					return res.send({});
				}
				res.send(coders);
			});
		});
	};

	this.add = function(req, res, next){
		var userDetails = {
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			username : req.body.username,
			//status : 'requested'
		};
	    
		req.getConnection(function(err, connection){
			var githubProcessor = new GithubProcessor(new UpdateDetails(connection, io));

			connection.query("select * from coders where username = ?", [userDetails.username], function(err, coder){
				//
		        if (coder && coder.length == 0){
		            connection.query("insert into coders set ?", userDetails, 
		            function(err, coder){
		            	if (err){
		                	logger.error(err.stack);
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
	};

	this.refresh = function (req, res) {
		req.getConnection(function(err, connection){
			//
			var githubProcessor = new GithubProcessor(new UpdateDetails(connection, io));

			connection.query("select username from coders", [], function (err, coders) {
				if (err){
	            	logger.error(err.stack);
	            	io.emit('error', {error : err});
					return;
	        	}

				coders.forEach(function (coder) {
					githubProcessor.events(coder.username);
				});

				res.send({coders : coders.length});
			});
			//
		});
	};

}


