
var GithubProcessor = require('./github-processor');
var UpdateDetails = require('./update-details');
var logger=require('./log.js');
var _ = require('lodash');
var Promise = require("bluebird");
var co = require('co');
var termDropdownUtil = require('./utils/term-dropdown');
var join = Promise.join;

var coderCommitHistory = function(coderService){

	return co(function *(){

		var coders = yield coderService.getCoderData();
		var commitsPerWeek = yield coderService.findCommitsPerWeek();

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

	var coderService = function(req, cb){
		req.services(function(err, services){
			var coderService = services.coderService;
			cb(coderService, services)
		});
	};

	this.list = function(req, res, next){
		req.services(function(err, services){
			var coderService = services.coderService;
			co(function * (){
				try{
					console.log("list...");

					var codersCommitHistory = yield coderCommitHistory(coderService);
					console.log("list...");

					res.render('coders', {
						coders : JSON.stringify(codersCommitHistory)
					});
				}
				catch(e){
					next(err);
				}
			});
		});
	};

	this.allCoders = function(req, res, next){

		req.services(function(err, services){

			//cb(coderService, services)
			co(function *() {

				try{
					var service = services.coderService;
					var coders = yield service.getCoderData();
					var	coderStages = yield service.coderStages();

					var coderList = termDropdownUtil(coders, coderStages);
					res.render("coder-list", {
						coders : coderList
					});

				}
				catch(err){
					next(err);
				}
			});
		});

		// coderService(req, function(service){
		//
		// 	service
		// 	.getCoderData()
		// 	.then(function(coders){
		//
		// 		var coderList = termDropdownUtil(coders);
		// 		res.render("coder-list", {
		// 			coders : coderList
		// 		});
		//
		// 	})
		// 	.catch(function(err){
		// 		next(err);
		// 	});
		//
		// });
	};

	this.updateCodersTerm = function(req, res, next){
		coderService(req, function(service){
			var data = req.body;
			data.id = req.params.coder_id;

			service
				.updateCoderTerm(data)
				.then(function(){
					res.redirect("/coders");
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
					res.send(coderCommitsPerWeek);
				});
		});
	};

	this.mostRecentCommits = function(req, res) {
		req.services(function(err, services){
			var coderService = services.coderService;
			coderService
				.findMostRecentCommits()
				.then(function(commits){
					res.send(commits);
				});
		});
	};

	this.allRecentCommits = function(req, res) {
		req.services(function(err, services){
			var coderService = services.coderService;
			coderService
				.listAllRecentCommits()
				.then(function(commits){
					res.send(commits);
				});
		});
	};



	this.refresh = function (req, res) {
		req.services(function(err, services){
			//
			var githubProcessor = services.githubProcessor;
			var coderService = services.coderService;
			logger.info("do refresh");
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

	this.recentActiveRepositories = function (req, res, next) {
		req.services(function(err, services){
			const coderService = services.coderService;
			coderService
				.recentActiveRepositories(Number(req.params.days))
				.then(function(repositories){
					res.send(repositories);
				});
		});
	}

};
