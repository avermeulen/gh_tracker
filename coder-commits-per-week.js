var _ = require('lodash');

/*
this logic only work for commits in the same year.
If commits span the end of one year and the start of another it doesn't work.

Weeks 48, 50, 51, 2, 3 won't work...
*/

module.exports =  function(coderCommits){

    var allCommits = _.flatten(coderCommits);

    var min = _.min(allCommits, (commit) => commit.week);

    var max = _.max(allCommits, (commit) => commit.week);

    var weekRange = _.range(min.week, max.week + 1);

    var commits = _.groupBy(coderCommits, function (commit) {
      return commit.username;
    });

    // -- ?
    var coders = _.keys(commits);
    var codersCommitCounts = {};

    coders.forEach(function(coder){
      var coderCommits = commits[coder];

      var coderCommitHistory = _.map(weekRange, function(week){
        var commit = _.find(coderCommits, function	(commit) {
          return commit.week === week;
        });
        return commit ? commit.commitCount : 0;
      });

      codersCommitCounts[coder] = _.takeRight(coderCommitHistory, 8);

    });

    return codersCommitCounts;
};
