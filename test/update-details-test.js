var assert = require('assert');
var UpdateDetails = require('../update-details');
var mysql = require('mysql');

describe("Update details test", function(){

  var connection = mysql.createConnection({
        host: 'localhost',
        user: 'gh',
        password: 'password',
        port: 3306,
        database: 'gh_tracker'
  });

  connection.connect();

  it("should test say username is invalid", function(done){
    
    var updateDetails = new UpdateDetails(connection, {
      emit : function (params) {
        assert.equal('invalid username : test', params);
        done();
      }
    });

    updateDetails.updateUserEvents({
      id : 100,
      user : 'test'
    });

  });
});
