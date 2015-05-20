var mysql = require('mysql');
var async = require('async');
var moment = require('moment');

var DatabaseConnection = function(params){
    return mysql.createConnection({
        host     : params.host || 'localhost',
        user     : params.username || 'root',
        password : params.password || 'passw0rd',
        database : params.database || 'gh_tracker'
    });
}

module.exports = function () {

	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'passw0rd',
		database : 'gh_tracker'
	});

	connection.connect();

    var data = {
        firstName : "Andre",
        lastName : "Vermeulen",
        username : "avermeulen"

    };

	//
	this.store = function(userDetails, cb) {

		var createCoders = function (cb) {
			connection.query("insert into coders (firstName, lastName, username) set ?", coderData, function(err, coder){
				cb(err, coder);
			});
		};

        var createEvents = function (coder, cb) {

			var events = userDetails.events.map(function(event){

                return {
                    id : event.id,
                    type : event.type,
                    event_date : event.event_date,
                    created_at : event.created_at,
                    repositoryUrl : event.repositoryUrl,
                    repositoryName : event.repositoryName,
                    coder_id : coder.id
                };

			});

            connection.query("insert into events set ?", events, function(err, coder){
                cb(err, coder);
            });

		};

		var createRepositories = function (cb) {

            var repositories = userDetails.repositories.map(function(repo){
                return {
                    repositoryName : repo.name,
                    created_at : repo.created_at,
                    last_updated : repo.lastUpdated,
                    coder_id : coder.id
                };
            });

            connection.query("insert into repositories values (repositoryName, create_at, last_updated, coder_id) set ?",
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