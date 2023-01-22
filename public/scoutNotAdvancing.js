app.component('scoutsnotadvancing', {
  bindings : {
    scouts: '<',
    minAge: '<'
  },
  templateUrl:  'templates/scoutNotAdvancing.html',
  controller: ['ScoutbookDBService', function(ScoutbookDBService) {
    const _this = this;
    _this.scoutsNotAdvancing = [];

    _this.getCurrentRankText = function(scout) {
      return ScoutbookDBService.getCurrentRankText(scout);
    }
    _this.getRankDate = function(scout) {
      let date;
      const currentRank = ScoutbookDBService.getCurrentRank(scout);
      const rankDate = ScoutbookDBService.getRankDate(scout, currentRank);
      if (rankDate) {
        date = rankDate.getMonth()+1 + '/' + rankDate.getDate()+'/'+rankDate.getFullYear();
      }
      return date;
    };

    _this.getJoinDate = function(scout) {
      let date;
      const joinDate = ScoutbookDBService.getDate(scout._dateJoinedUnit);
      if (joinDate) {
        date = joinDate.getMonth()+1 + '/' + joinDate.getDate()+'/'+joinDate.getFullYear();
      }
      return date;
    };

    _this.$onChanges = function(changes) {

      _this.scouts =  ScoutbookDBService.getActiveScouts(changes.scouts.currentValue);
      var numberOfScoutsNotAdvancing = 0;
      _this.scouts.forEach(function(scout) {

        var currentRank = ScoutbookDBService.getCurrentRank(scout);
        var currentRankText = ScoutbookDBService.getCurrentRankText(scout);
        var rankDate = ScoutbookDBService.getRankDate(scout,currentRank);


        if ((rankDate === undefined ) ||
          (rankDate && _this.olderThanMinAge(rankDate,1) && (currentRankText !== 'Eagle' && currentRankText !== 'Life'))) {
          _this.scoutsNotAdvancing.push(scout);
          ++numberOfScoutsNotAdvancing;
        }
      });

      // sort by birthday descending
      _this.scoutsNotAdvancing.sort(function(a,b) {
        const aRank = ScoutbookDBService.getCurrentRank(a);
        const bRank = ScoutbookDBService.getCurrentRank(b);
        var aDate = ScoutbookDBService.getRankDate(a,aRank);
        var bDate = ScoutbookDBService.getRankDate(b,bRank);
        var aTime, bTime;
        if (aDate === undefined) {
          aTime = 0;
        } else {
          aTime = aDate.getTime();
        }
        if (bDate === undefined) {
          bTime =0;
        } else {
          bTime = bDate.getTime();
        }
        return  aTime - bTime;
      });
    };

    _this.olderThanMinAge = function(minAgeDate, minAge) {
      var rv = false;
      minAgeDate.setFullYear(minAgeDate.getFullYear()+minAge);
      var now = new Date();

      if (minAgeDate < now)
        rv = true;

      return rv;
    };

  }]
});
