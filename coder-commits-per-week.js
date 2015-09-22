var _ = require('lodash');

module.exports =  function(coderCommits){

  var min = _.min(coderCommits, function (commit) {
    return commit.week;
  });

    var max = _.max(coderCommits, function (commit) {
      return commit.week;
    });

    var commits = _.groupBy(coderCommits, function (commit) {
      return commit.username;
    });

    var weekRange = _.range(min.week, max.week);

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
