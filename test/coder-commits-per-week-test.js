
var CoderCommitsPerWeek = require('../coder-commits-per-week');

var coderCommits = require('./coder-commits.json');


var assert = require('assert');

describe("Coder Commits per Week", function(){

  it("go", function(){

    var ccpw = new CoderCommitsPerWeek(coderCommits);
    assert.deepEqual(ccpw, {});

  });

});
