var GithubEvents = require("./github/github-events");

module.exports = function (updateDetails) {
	
	var gevents = new GithubEvents();
	
	gevents.on('events', function (events) {
		console.log(events);
		var event = events && events.length > 0 ? events[0] : 0;
		updateDetails.updateUserEvents(event);
		
	});
	
	gevents.on('error', function (err) {
		// publish errors
	});
	
	this.events = function (username) {
		console.log(username);
		gevents.userEvents(username);
		return this;
	}
};