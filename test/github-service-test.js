var githubService = require('../github/github-service');

describe('github service', function () {
	it('should find...', function (done) {
		
		githubService.dataForUser("avermeulen")
		.then(function(details){
			done();
		});

	});
});