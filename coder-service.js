var Promise = require("bluebird"),
	Query = require("./query-promise"),
	coderCommitsPerWeek = require('./coder-commits-per-week'),
	co = require('co');;

module.exports = function (connection) {

	var query = new Query(connection);

	this.getCoderData = function()  {
		var coderSql = "call UsersWithRepos()"
		return query.executeProc(coderSql);
	};

	this.findCoderByUsername = function(username){
		return query.execute("select * from coders where username = ?",
			[username]);
	};

	this.createCoder = function(coderDetails){
		return query.execute("insert into coders set ?", coderDetails)
	};

	this.findAllUsernames = function(cb){
		return query.execute("select username from coders", []);
	};

	this.findCommitsPerWeek = function(){
		return co(function *() {
			var sql = "call UserCommitsPerWeekForCurrentYear()";
			var commitsPerWeek = yield query.executeProc(sql);
			return coderCommitsPerWeek(commitsPerWeek);
		});
	};

	this.findMostRecentCommits = function() {
		var sql = "select username, repositoryName, max(created_at) as lastCommitTime, count(*) activityCount from coders join events on events.coder_id = coders.id group by username, repositoryName order by lastCommitTime desc";
		return query.execute(sql);
	};

	this.listAllRecentCommits = function() {
		var sql = "select * from coders join events on events.coder_id = coders.id order by created_at desc";
		return query.execute(sql);
	};

	this.recentActiveRepositories = function(inDays){
		var sql = "select repositoryName, max(created_at) activeDatetime from events where created_at > date_sub(now(), interval ? day) group by repositoryName order by activeDatetime desc;"
		return query.execute(sql, inDays);
	}

	this.coderStages = function(inDays){
		return query.execute("select id, stage_name from coder_stages;");
	}

	this.updateCoderTerm = function(data){
		console.log(data);
		var sql = "update coders set stage_id = ? where id = ?";
		return query.execute(sql, [data.stage_id, data.id] );
	};
}
