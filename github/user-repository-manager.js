var Promise = require('bluebird');

var UserRepositoryActivity = function(repositories, repositoryStore){

	this.track = function(userDetails, cb){
		repositories
			.dataForUser(userDetails.username)
			.then(function(details){
				var events = details[0],
					repositories = details[1],
					userEntry = {
						
						username : userDetails.username,
						firstName : userDetails.firstName,
						lastName : userDetails.lastName,

						events : events,
						repositories : repositories
					};

				repositoryStore.store(userEntry, cb);

			});
	};

	this.untrack = function(username){

	}

	this.refresh = function(username){

	};

	this.refreshAll = function(){

	};
};

module.exports = UserRepositoryActivity;