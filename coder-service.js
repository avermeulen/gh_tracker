var Promise = require("bluebird");

var Query = function(connection){
	this.execute = function (query, params) {
		var queryParams = params || {};
		return new Promise(function (resolve, reject) {
			connection.query(query, queryParams, function (err, results) {
				if(err){
					return reject(err);
				}
				else {
					resolve(results);
				}
			});
		});
	}
};

module.exports = function (connection) {

	var query = new Query(connection);

	this.getCoderData = function()  {
		var coderSql = "select firstname as firstName, lastname as lastName, username, coder_id, min(datediff(date(now()), date(created_at))) active_days_ago from events, coders where coders.id = events.coder_id  group by coder_id order by active_days_ago;";
		return query.execute(coderSql);
	};

	this.findCoderByUsername = function(username){
		return query.execute("select * from coders where username = ?", [username]);
	};

	this.createCoder = function(coderDetails){
		return query.execute("insert into coders set ?", coderDetails)
	};

	this.findAllUsernames = function(cb){
		return query.execute("select username from coders", []);
	};

	this.findCommitsPerWeek = function(){
		var sql = "select username, week(created_at), count(*) from coders join events where events.coder_id = coders.id group by username, week(created_at)"
		return query.execute(sql);
	}

}
