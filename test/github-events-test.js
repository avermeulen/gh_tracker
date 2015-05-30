var GithubEvents = require("../github/github-events");
var assert = require('assert');

describe("Github events", function(){
	this.timeout(5000);	

	it("should find users repositories", function(done){
		var gevents = new GithubEvents();
		
		gevents.on('repositories', function (repos) {
			assert.equal(21, repos.length);
			done();
		});
		
		gevents.on('error', function (err) {
			done();
		});
		
		gevents.userRepositories('avermeulen');
		
	});

	it("should find users events", function(done){
		var gevents = new GithubEvents();
		
		gevents.on('events', function (events) {
			assert.equal(30, events.length);
			done();
		});
		
		gevents.on('error', function (err) {
			done();
		});
		
		gevents.userEvents('avermeulen');
		
	});

});