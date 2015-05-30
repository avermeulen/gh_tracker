var MySqlStore = require('../github/repository-store-mysql');

var assert = require('assert');

describe("repository mysql store" , function () {

    beforeEach(function() {



    });

    it('should create user', function(done){

        var data = {
                firstName : "andre",
                lastName : "vermeulen",
                username : "av_tester"
            };

        var mySqlStore = new MySqlStore()

        mySqlStore.manageUser(data, function(err, data){

            assert.equal(err, undefined);
            done();
            
        });

    });

    it("should store", function(done){

        done();
        
        /*
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
        */

    });
});