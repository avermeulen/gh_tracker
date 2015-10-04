
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');
var logger=require('./log.js');
var _ = require('lodash');
var Promise = require("bluebird");
var join = Promise.join;

var coderCommitHistory = function(coderService){

	return join(coderService.getCoderData(),
		coderService.findCommitsPerWeek(),
		function(coders, commitsPerWeek) {
			var coderCommitHistory = coders.map(function(coder){
				if (_.has(commitsPerWeek, coder.username)){
					var commits =  commitsPerWeek[coder.username];
					coder.commits = commits.join(",");
				}
				else {
					coder.commits = "";
				}
				return coder;
			});
			return coderCommitHistory;
		});
};

module.exports = function(io){

	this.list = function(req, res, next){
		req.services(function(err, services){
			var coderService = services.coderService;
			coderCommitHistory(coderService)
			.then(function(codersCommitHistory){
				res.render('coders', {
					coders : JSON.stringify(codersCommitHistory)
				});
			})
			.catch(function(err){
				next(err);
			});
		});
	};

	this.all = function(req, res, next){
		req.services(function(err, services){
			var coderService = services.coderService;
			coderCommitHistory(coderService)
			.then(function(codersCommitHistory){
				res.send( codersCommitHistory);
			})
			.catch(function(err){
				next(err);
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
			//
			var addCoder = function(coder){
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
			};

			coderService
				.findCoderByUsername(userDetails.username)
				.then(addCoder);
		});
	};

	this.commitsPerWeek = function(req, res) {
		req.services(function(err, services){
			var coderService = services.coderService;
			coderService
				.findCommitsPerWeek()
				.then(function(coderCommitsPerWeek){
					res.send( coderCommitsPerWeek);
				});
		});
	}

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
