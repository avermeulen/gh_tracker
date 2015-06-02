var Promise = require('bluebird'),
	moment = require('moment'),
	github = require("./github"),
	util = require('util'),
	events = require('events');;

function GithubEvents () {
	events.EventEmitter.call(this);
};

util.inherits(GithubEvents, events.EventEmitter);

GithubEvents.prototype.userEvents = function (username) {
	var self = this;
	process.nextTick(function(){	
		github.userEvents(username, function (err, events) {
		if (err)
			self.emit('error', err);
		else
			self.emit('events', events);
		});	
	});
	
};
	
GithubEvents.prototype.userRepositories = function (username) {
	var self = this;
	process.nextTick(function(){
		github.userRepos(username, function (err, repos) {		
		if (err)
			self.emit('error', err)
		else
			self.emit('repositories', repos);
		});
	});
};

module.exports = GithubEvents;