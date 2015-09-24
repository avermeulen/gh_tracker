
var coderCommitsPerWeek = require('../coder-commits-per-week');

var coderCommits = require('./coder-commits.json');


var assert = require('assert');

describe("Coder Commits per Week", function(){

    it("should find consecutive weeks data", function(){

        var coderCommits = [ { "username": "avermeulen", "week": 19, "commitCount" : 1 },
          { "username": "avermeulen", "week" : 20, "commitCount" : 6 },
          { "username": "avermeulen", "week" : 21, "commitCount" : 2 },
          { "username": "ayabongaqwabi", "week" : 19, "commitCount" : 1 },
          { "username": "ayabongaqwabi", "week" : 20, "commitCount" : 1 },
          { "username": "ayabongaqwabi", "week" : 21, "commitCount" : 1 }];

          var ccpw = coderCommitsPerWeek(coderCommits);

          assert.deepEqual(ccpw, {
                'avermeulen' : [1,6,2],
                'ayabongaqwabi' : [1,1,1]});

    });

    it("should handle not consecutive weeks fine", function(){

        var coderCommits = [ { "username": "avermeulen", "week": 17, "commitCount" : 1 },
          { "username": "avermeulen", "week" : 20, "commitCount" : 6 },
          { "username": "avermeulen", "week" : 21, "commitCount" : 2 },
          { "username": "ayabongaqwabi", "week" : 19, "commitCount" : 1 },
          { "username": "ayabongaqwabi", "week" : 20, "commitCount" : 1 },
          { "username": "ayabongaqwabi", "week" : 23, "commitCount" : 1 }];

        var ccpw = coderCommitsPerWeek(coderCommits);
        assert.deepEqual(ccpw, {
              'avermeulen' : [1,0,0,6,2,0,0],
              'ayabongaqwabi' : [0,0,1,1,0,0,1]});

    });

});
