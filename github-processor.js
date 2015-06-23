var logger = require('winston');
var GithubEvents = require("./github/github-events");

module.exports = function (updateDetails) {
	
	var gevents = new GithubEvents();
	
	gevents.on('events', function (events) {
		var event = events && events.length > 0 ? events[0] : 0;
		updateDetails.updateUserEvents(event);
		
	});
	
	gevents.on('error', function (err) {
		// publish errors
		logger.error(err);
	});
	
	this.events = function (username) {
		logger.info('get events for : ' + username);
		gevents.userEvents(username);
		return this;
	}
};