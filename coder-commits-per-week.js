var _ = require('lodash');

module.exports =  function(coderCommits){

    var allCommits = _.flatten(coderCommits);

    var min = _.min(allCommits, function (commit) {
        return commit.week;
    });

    var max = _.max(allCommits, function (commit) {
      return commit.week;
    });
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
