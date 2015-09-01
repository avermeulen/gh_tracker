
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');
var logger=require('./log.js');
var _ = require('lodash');

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
				.then(function(coderCommits) {

						var min = _.min(coderCommits, function (commit) {
							return commit.week;
						});

						var max = _.max(coderCommits, function (commit) {
							return commit.week;
						});

						var commits = _.groupBy(coderCommits, function (commit) {
							return commit.username;
						});

						var weekRange = _.range(min.week, max.week);

						// -- ?
						var coders = _.keys(commits);
						var coderCommitStream = {};

						coders.forEach(function(coder){
							var coderCommits = commits[coder];

							var coderCommitHistory = _.map(weekRange, function(week){
								var commit = _.find(coderCommits, function	(commit) {
									return commit.week === week;
								});
								return commit ? commit.commitCount : 0;
							});

							coderCommitStream[coderCommitHistory] = c;

						});

						res.send(coderCommitStream);

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
