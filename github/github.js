var github = require("octonode");

var client = github.client();

exports.userRepos = function(userName, cb){

		client.get('/users/' + userName + '/repos', {}, 
			function (err, status, body, headers) {

				if (err)
					cb(err, null);
				else{
					var repos = body.map(function(entry){
	  					return {
	  					 	name : entry.name,
	  					 	'created_at' : entry.created_at,
	  					 	'updated_at' : entry.updated_at,
	  					 	'pushed_at' : entry.pushed_at
	  					 };
	  				});
  					cb(null, repos)
				}
		});

	};

exports.userEvents = function(userName, cb){

		client.get('/users/' + userName + '/events', {}, 
			function (err, status, body, headers) {

				if (err)
					cb(err, null);
				else{

					var events = body.map(function(userEvent){

						return {
							id : userEvent.id,
							user : userEvent.actor.login,
							type : userEvent.type,
							repo : userEvent.repo.url,
							repo_name : userEvent.repo.name,
							created_at : userEvent.created_at
						};
					})

  					cb(null, events);
				}
		});

	};