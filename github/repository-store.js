var mongoose = require('./mongoose');

module.exports = function () {

	//
	this.store = function(userDetails, cb){

		var coder = new mongoose.Coder();

		coder.firstName = userDetails.firstName;
		coder.lastName = userDetails.lastName;
		coder.username = userDetails.username;

		coder.repositories = userDetails.repositories.map(function(repo){
			return {
				name : repo.name,
				created : repo.created_at,
				updated : repo.updated_at
			}
		});

        coder.activities = userDetails.events.map(function(event){
            return {
                type : event.type,
                repositoryUrl : event.repo,
                repositoryName : event.repo_name,
                created : event.created_at
            }
        });

		coder.save(function(err){
			if (err){
				console.log(err.code);
				return cb(err, null);
			}
			cb(null, coder);
		});

	}
}