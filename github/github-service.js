var Promise = require('bluebird'),
	moment = require('moment'),
	github = Promise.promisifyAll(require("./github"));

exports.dataForUser = function (username){

	return Promise.join(
		github.userEventsAsync(username),
		github.userReposAsync(username));

}