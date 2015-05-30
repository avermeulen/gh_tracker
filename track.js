var githubService = require("./github/github-service");
var UserRepositoryManager = require("./github/user-repository-manager");
var RepositoryStore = require("./github/repository-store-mysql");

module.exports = function (connection) {
    
    var userRepoManager = new UserRepositoryManager(githubService, new RepositoryStore(connection));
        
    this.trackUser = function(userDetails, cb){
        userRepoManager.track(userDetails, cb);
    };
    
};