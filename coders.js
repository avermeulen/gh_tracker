
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');

module.exports = function(io){

	this.list = function(req, res, next){
		req.services(function(err, services){
			var coderService = services.coderService;
			coderService.getCoderData(function(err, coders){
				if (err){
					logger.error(err.stack);
					return next(err);
				}
				res.render('coders', {coders : JSON.stringify(coders)})
			});
		});
	};

	this.all = function(req, res, next){
		req.services(function(err, services){

			var coderService = services.coderService;
			coderService.getCoderData(function(err, coders){
				if (err){
					logger.error(err.stack);
					return next(err);
				}
				res.render(coders);
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

			coderService.findCoderByUsername(userDetails.username, function(err, coder){
				//
		        if (coder && coder.length == 0){
		        	coderService.createCoder(userDetails, function(err, coder){
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

			coderService.findAllUsernames(function (err, coders) {
				if (err){
	            	logger.error(err.stack);
	            	io.emit('error', {error : err});
					return;
	        	}

				coders.forEach(function (coder) {
					githubProcessor.getUserEvents(coder.username);
				});

				res.send({coders : coders.length});
			});
			//
		});
	};

}


