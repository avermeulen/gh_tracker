
var assert = require('assert');
var request = require('request');

describe('the gh_tracker api', function(){

    it('should return stats for all the coders', function(done){

        request('http://localhost:3000/api/coders',
            function(err, response, body){
                var users = JSON.parse(response.body);
                assert(users.length > 1);
                done();
            });
});


})
