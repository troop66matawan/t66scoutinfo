app.component('scoutsnotadvancing', {
  bindings : {
    scouts: '<',
    minAge: '<'
  },
  template:   '<div class="scoutsnotadvancing">'+
  '<div class="header">Scouts Not Advancing Report</div>' +
  '<div class="table">' +
  '<div class="tr th">'+'' +
  //		return "Last Name, First Name, Rank, Rank Date"

  '<div class="td">Last name</div><div class="td">First Name</div><div class="td">Rank</div>'+'' +
  '<div class="td">Rank Date</div>'+
  '</div>'+
  '<div class="tr" ng-repeat="scout in $ctrl.scoutsNotAdvancing">'+
  '<div class="td">{{scout._lastName}}</div><div class="td">{{scout._firstName}}</div>'+'' +
  '<div class="td"><currentrank rankadv="scout._rankAdvancement"></currentrank></div>'+
  '<div class="td"><scoutdate date="$ctrl.getRankDate(scout._rankAdvancement)"></scoutdate></div>' +
  '</div>'+
  '</div>'+
  '</div>',
  controller: ['RankAdvancement', function(RankAdvancement) {
    const _this = this;
    _this.scoutsNotAdvancing = [];

    _this.getRankDate = function(rankAdv) {
      return RankAdvancement.getCurrentRankDate(rankAdv);
    };

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      var numberOfScoutsNotAdvancing = 0;
      _this.scouts.forEach(function(scout) {
        var rank = scout._rankAdvancement;

        var rankDate = RankAdvancement.getCurrentRankDate(rank);
        var currentRank = RankAdvancement.getCurrentRankText(rank);

        if ((rankDate === undefined) || (rankDate && _this.olderThanMinAge(rankDate,1) && currentRank !== 'Eagle')) {
          _this.scoutsNotAdvancing.push(scout);
          ++numberOfScoutsNotAdvancing;
        }
      });

      // sort by birthday descending
      _this.scoutsNotAdvancing.sort(function(a,b) {
        var aDate = RankAdvancement.getCurrentRankDate(a._rankAdvancement);
        var bDate = RankAdvancement.getCurrentRankDate(b._rankAdvancement);
        var aTime, bTime;
        if (aDate === undefined) {
          aTime = 0;
        } else {
          aTime = aDate.time;
        }
        if (bDate === undefined) {
          bTime =0;
        } else {
          bTime = bDate.time;
        }
        return  aTime - bTime;
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

  }]
});
