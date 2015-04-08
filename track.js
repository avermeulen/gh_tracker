
var repositories = require("./github/repositories");
var UserRepositoryManager = require("./github/user-repository-manager");
var RepositoryStore = require("./github/repository-store");

var userRepoManager = new UserRepositoryManager(repositories, new RepositoryStore());

exports.trackUser = function(userDetails, cb){

    userRepoManager.track(userDetails, cb);

};