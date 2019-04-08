angular.module('t66tmweb').component('leadershipreport', {
  bindings : {
    scouts: '<',
  },
  template:   '<div class="leadershipreport">'+
  '<div class="header">Scout Leadership Attendance Report</div>' +
  '<div class="table">' +
  '<div class="tr th">'+'' +
    // Last Name, First Name, Rank, Rank Date, Leadership Position
    '<div class="td">Last name</div><div class="td">First Name</div><div class="td">Rank</div>'+'' +
    '<div class="td">Rank Date</div><div class="td position">Leadership Position</div>'+
    '<div class="td">Camping (Attendance / Expected) %</div>'+
  '</div>'+
  '<div class="tr" ng-repeat="scout in $ctrl.currentleaderpositions">'+
    '<div class="td">{{scout._lastName}}</div>' +
    '<div class="td">{{scout._firstName}}</div>' +
    '<div class="td"><currentrank rankadv="scout._rankAdvancement"></currentrank></div>'+
    '<div class="td"><scoutdate date="$ctrl.getRankDate(scout._rankAdvancement)"></scoutdate></div>' +
    '<div class="td position"><position por="scout.por" scout="scout"></position></div>' +
    '<div class="td {{$ctrl.styleBackgroundCamping(scout.por,scout)}}">'+
      '{{$ctrl.getCampingPercent(scout.por,scout)}} / {{$ctrl.getExpectedPercent(scout.por,scout)}}'+
    '</div>' +
  '</div>'+
  '</div>'+
  '</div>',
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
            if (_this.isCurrentPosition(scout._reportDate, por._endDate)) {
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

    _this.isCurrentPosition = function(reportDate,posEndDate) {
      var rv = false;
      function timeToDate(time) {
        var date = new Date(time);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
      }
      var reportTime = timeToDate(reportDate.time);
      var posTime = timeToDate(posEndDate.time);

      if (posTime.getTime() === reportTime.getTime()) {
        rv = true;
      }
      return rv;
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
