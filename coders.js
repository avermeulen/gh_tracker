
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');
var logger=require('./log.js');

module.exports = function(io){

	this.list = function(req, res, next){
		req.services(function(err, services){
			var coderService = services.coderService;
			coderService
				.getCoderData()
				.then(function(coders){
					res.render('coders', {coders : JSON.stringify(coders)})
				})
				.catch(function(err){
						logger.error(err.stack);
						return next(err);
				});
		});
	};

	this.all = function(req, res, next){
		req.services(function(err, services){

			var coderService = services.coderService;
			coderService
				.getCoderData()
				.then(function(coders){
					res.send(coders);
				})
				.catch(function (err) {
					logger.error(err.stack);
					return next(err);
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

		req.services(function(err, services){

			var githubProcessor = services.githubProcessor;
			var coderService = services.coderService;

			coderService.findCoderByUsername(userDetails.username)
			.then(function(coder){
				//
	        if (coder && coder.length == 0){
	        	coderService
							.createCoder(userDetails)
							.then(function(coder){
	              	io.emit('coder_added', {data : userDetails});
	          	})
							.catch(function(err) {
								logger.error(err.stack);
								io.emit('error', {error : err});
							});
	        }
	        else{
							logger.error('coder already exists!');
	            io.emit('coder_exists', {data : userDetails})
	        }
					githubProcessor.getUserEvents(userDetails.username);
					res.send({done : true});
	    	});
		});
	};

	this.refresh = function (req, res) {
		req.services(function(err, services){
			//
			var githubProcessor = services.githubProcessor;
			var coderService = services.coderService;

			coderService
				.findAllUsernames()
				.then(function (coders) {
					coders.forEach(function (coder) {
						githubProcessor.getUserEvents(coder.username);
					});
					res.send({coders : coders.length});
				})
				.catch(function(err){
					//
	      	logger.error(err.stack);
	      	io.emit('error', {error : err});
				});
		});
	};

};
