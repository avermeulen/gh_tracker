var MySqlStore = require('../github/repository-store-mysql');

var assert = require('assert');

describe("repository mysql store" , function () {

    beforeEach(function() {



    });

    it("should store", function(done){

        var coderData = {
            firstName : userDetails.firstName,
            lastName : userDetails.lastName,
            username : userDetails.username,
            events : [

                {
                    id : 1,
                    type : "testing",
                    event_date : "",
                    created_at : "",
                    repositoryUrl : "",
                    repositoryName : ""
                }
            ],
            repositories : [
                {
                    name : "",
                    created_at : "",
                    last_updated : ""
                }
            ]

        };


        var mySqlStore = new MySqlStore();

        mySqlStore.store(coderData, function(err, user){

            assert.equal(null, err);

            assert.equal(user.username, "avermeulen");

            done();

        });

    });
});