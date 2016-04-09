/**
 * Promise based Query executor
 */
module.exports = function(connection){
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

	this.executeProc = function (query, params) {
		var queryParams = params || {};
		return new Promise(function (resolve, reject) {
			connection.query(query, queryParams, function (err, results) {
				if(err){
					return reject(err);
				}
				else {
					resolve(results[0]);
				}
			});
		});
	}
};
