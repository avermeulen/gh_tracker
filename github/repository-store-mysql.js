var async = require('async');
var moment = require('moment');

module.exports = function (connection) {

    this.manageUser = function(userDetails, cb){

        var data = {
                firstName : userDetails.firstName,
                lastName : userDetails.lastName,
                username : userDetails.username
            };
        
        connection.query("select * from coders where username = ?", [userDetails.username], function(err, coder){
            if (!coder){
                connection.query("insert into coders set ?", data, 
                function(err, coder){
                    console.log(err);
                    console.log(coder);
                    cb(null, coder)
                });
            }
            else{
                cb(err, null);
            }
        });
    };

	//
	this.store = function(userDetails, cb) {

		var createCoders = function (cb) {
            var data = {
                firstName : userDetails.firstName,
                lastName : userDetails.lastName,
                username : userDetails.username
            };

			connection.query("insert into coders set ?", data, 
                function(err, coder){
				    cb(err, {
                        id : coder.insertId
                    });
			});
		};

        var createEvents = function (coder, cb) {

			var events = userDetails.events.map(function(event){

                return [
                    event.id,
                    event.type,
                    //event.event_date,
                    event.created_at,
                    event.repo,
                    event.repo_name,
                    coder.id
                ];

			});
                      
            connection.query("insert into events (id,type, created_at, repositoryUrl, repositoryName, coder_id) values ?", 
                    [events], function(err, eventData){
                cb(err, coder, eventData);
            });

		};

		var createRepositories = function (coder, eventData, cb) {

            var repositories = userDetails.repositories.map(function(repo){
                return {
                    repositoryName : repo.name,
                    created_at : repo.created_at,
                    last_updated : repo.lastUpdated,
                    coder_id : coder.id
                };
            });

            connection.query("insert into repositories set ?",
                repositories, function(err){
                cb(err);
            });

		};

		async.waterfall([
			createCoders,
			createEvents,
			createRepositories],
			cb);

	}
}