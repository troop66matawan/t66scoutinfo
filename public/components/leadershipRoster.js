angular.module('t66tmweb').component('leadershipRoster', {
  bindings : {
    scouts: '<',
  },
  templateUrl:   'templates/leadershipRoster.html',
  controller: LeadershipRoster
});

function LeadershipRoster(ScoutbookLeadershipService, ScoutbookDBService, porService) {
  const _this = this;
  _this.currentleaderpositions = [];

  _this.getCurrentRankDate = function(scout) {
    let curRankDate = undefined;
    let date = '';
    const curRank = ScoutbookDBService.getCurrentRank(scout);
    if (curRank) {
      curRankDate = ScoutbookDBService.getRankDate(scout,curRank);
    }
    if (curRankDate) {
      date = curRankDate.getMonth()+1 + '/' + curRankDate.getDate()+'/'+curRankDate.getFullYear();
    }
    return date;
  };
  _this.getCurrentRank = function(scout) {
    return ScoutbookDBService.getCurrentRankText(scout);
  };

  _this.$onChanges = function(changes) {
    _this.scouts =  changes.scouts.currentValue;
    _this.scouts.forEach(function(scout) {
      const curPositions = ScoutbookLeadershipService.getCurrentLeadershipPositions(scout);
      if (curPositions && curPositions.length > 0) {
        curPositions.forEach(function(pos) {
          if (porService.isPositionForRank(pos._position)) {
            var scoutpor = {};
            scoutpor._lastName = scout._lastName;
            scoutpor._firstName = scout._firstName;
            scoutpor._nickname = scout._nickname;
            scoutpor._advancement = scout._advancement;
            if (scout._activities && scout._activities._camping) {
              scoutpor._camping = scout._activities._camping;
            }
            scoutpor.por = pos;
            _this.currentleaderpositions.push(scoutpor);
          }
        })
      }
    });

    // sort by birthday descending
    _this.currentleaderpositions.sort(function(a,b) {
      if (a._lastName < b._lastName) {
        return -1;
      } else if (a._lastName > b._lastName) {
        return 1;
      } else {
        if (a._firstName < b._firstName) {
          return -1;
        } else if (a._firstName > b._firstName) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  };





  _this.olderThanMinAge = function(rankDate, minAge) {
    var rv = false;
    var minAgeDate = new Date(rankDate.time);
    minAgeDate.setFullYear(minAgeDate.getFullYear()+minAge);
    var now = new Date();

    if (minAgeDate < now)
      rv = true;

    return rv;
  };

}