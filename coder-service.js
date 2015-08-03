module.exports = function (connection) {
	
	this.getCoderData = function (cb) {
		var coderSql = "select firstname as firstName, lastname as lastName, username, coder_id, min(datediff(date(now()), date(created_at))) active_days_ago from events, coders where coders.id = events.coder_id  group by coder_id order by active_days_ago;";
		connection.query(coderSql, {}, cb);
	};

	this.findCoderByUsername = function(username, cb){
		connection.query("select * from coders where username = ?", [username], cb);
	};

	this.createCoder = function(coderDetails, cb){
		connection.query("insert into coders set ?", coderDetails, cb)
	};

	this.findAllUsernames = function(cb){
		connection.query("select username from coders", [], cb);
	};

}