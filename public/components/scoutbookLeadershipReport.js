angular.module('t66tmweb').component('scoutbookLeadershipReport', {
  bindings : {
    scouts: '<',
  },
  templateUrl:   'templates/leadershipReport.html',
  controller: ['ScoutbookLeadershipService','porService', 'ScoutbookDBService', function(ScoutbookLeadershipService, porService, ScoutbookDBService) {
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
    }

    _this.getCampingPercent = function(por,scout) {
      return ScoutbookDBService.getCampingPercent(scout);
    };

    _this.getMeetingPercent = function(por, scout) {
      return ScoutbookDBService.getMeetingPercent(scout);
    };

    _this.getTotalAttendance = function(por, scout) {
      return ScoutbookDBService.getTotalPercent(scout);
    }

    _this.styleBackgroundTotal = function(por, scout) {
      const expectedTotal = 50;
      let totalPercent = ScoutbookDBService.getTotalPercent(scout);
      let style;

      if (totalPercent < expectedTotal) {
        if ((totalPercent + 10) >= expectedTotal) {
          style = 'blackonyellow';
        } else if (totalPercent + 20 >= expectedTotal) {
          style = 'whiteonred';
        } else {
          style = 'whiteonblack';
        }
      }

      return style;
    }

    _this.getExpectedPercent = function(por,scout) {
      return porService.getExpectedCampingAttendance(por._position);
    };

    _this.getExpectedMeetingPercent = function( por, scout) {
      return porService.getExpectedMeetingPercent(por._position);
    }

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
    _this.styleBackgroundMeeting = function(por,scout) {
      var meetingPercent = _this.getMeetingPercent(por,scout);
      var expectedMeetingPercent = porService.getExpectedMeetingPercent(por._position);
      var style = "";

      if (meetingPercent < expectedMeetingPercent) {
        if ((meetingPercent + 10) >= expectedMeetingPercent) {
          style = 'blackonyellow';
        } else if (meetingPercent + 20 >= expectedMeetingPercent) {
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

  }]
});
