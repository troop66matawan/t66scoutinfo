angular.module('t66tmweb').component('leadershipreport', {
  bindings : {
    scouts: '<',
  },
  templateUrl:   'templates/leadershipReport.html',
  controller: ['RankAdvancement', 'activityService','porService', function(RankAdvancement, activityService, porService) {
    const _this = this;
    _this.currentleaderpositions = [];

    _this.getRankDate = function(rankAdv) {
      return RankAdvancement.getCurrentRankDate(rankAdv);
    };

    _this.getCampingPercent = function(por,scout) {
      return  Math.trunc(100 * activityService.getScoutCampingPercentage(scout._camping,por._startDate.time,por._endDate.time));
    };

    _this.getExpectedPercent = function(por,scout) {
      return porService.getExpectedCampingAttendance(por._position);
    };

    _this.styleBackgroundCamping = function(por,scout) {
      var campingPercent = _this.getCampingPercent(por,scout);
      var expectedCampingPercent = porService.getExpectedCampingAttendance(por._position);
      var style = "";

      if (campingPercent < expectedCampingPercent) {
        if ((campingPercent + 10) >= expectedCampingPercent) {
          style = 'blackonyellow';
        } else if (campingPercent + 20 >= expectedCampingPercent) {
          style = 'whiteonred';
        } else {
          style = 'whiteonblack';
        }
      }

      return style;
    };

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      _this.scouts.forEach(function(scout) {

        if (scout._leadership && scout._leadership.length > 0 ) {
          scout._leadership.forEach(function(por) {
            if (porService.isPositionForRank(por._position) &&
              porService.isCurrentPosition(scout._reportDate, por._endDate)) {
              var scoutpor = {};
              scoutpor._lastName = scout._lastName;
              scoutpor._firstName = scout._firstName;
              scoutpor._rankAdvancement = scout._rankAdvancement;
              scoutpor._camping = scout._camping;
              scoutpor.por = por;
              _this.currentleaderpositions.push(scoutpor);
            }
          });
        }
      });

      // sort by birthday descending
      _this.currentleaderpositions.sort(function(a,b) {
        if (a._lastName < b._lastName) {
          return -1;
        } else if (a._lastName > b._lastName) {
          return 1;
        } else {
          if (a._firstname < b._firstName) {
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

  }]
});
