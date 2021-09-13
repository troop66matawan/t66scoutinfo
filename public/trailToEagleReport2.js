app.component('trailtoeaglereportv2', {
  bindings : {
    scouts: '<',
    minAge: '<'
  },
  templateUrl: 'templates/trailToEagleReport2.html',
  controller: ['EagleRequired','RankAdvancement','ScoutbookDBConstant','ScoutbookDBService', 'ScoutbookLeadershipService', 'ScoutbookActivityService',
    function(EagleRequired,RankAdvancement,ScoutbookDBConstant,ScoutbookDBService,ScoutbookLeadershipService, ScoutbookActivityService) {
    const _this = this;
    _this.trailToEagleScouts = [];

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      var numberOfTrailToEagleScouts = 0;
      _this.scouts.forEach(function(scout) {
        var rank = scout._advancement;
        let dob = ScoutbookDBService.getDate(scout._dob);
        if (dob) {
          scout._dateOfBirth = dob;
        } else {
          scout._dateOfBirth = new Date();
        }
        let exclude = false;
        let patrolName = scout._patrolName;
        if (patrolName !== undefined) {
          patrolName = patrolName.toLowerCase();
        }
        if (patrolName === 'inactive') {
          exclude = true;
        }

        if ( exclude === false && rank && (
            (!rank.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.EAGLE) ||
                (rank.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.EAGLE) && !rank[ScoutbookDBConstant.ADVANCEMENT.EAGLE]._isApproved)) &&
            (rank.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.LIFE) && rank[ScoutbookDBConstant.ADVANCEMENT.LIFE]._isApproved)  ||
                ((!rank.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.LIFE) ||
                    (rank.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.LIFE) && !rank[ScoutbookDBConstant.ADVANCEMENT.LIFE]._isApproved))
                    && (_this.olderThanMinAge(scout._dateOfBirth)))))
        {
          _this.trailToEagleScouts.push(scout);
          ++numberOfTrailToEagleScouts;
        }
      });

      // sort by birthday descending
      _this.trailToEagleScouts.sort(function(a,b) {
        return  a._dateOfBirth.getTime() - b._dateOfBirth.getTime();
      });
    }

    _this.getCurrentRank = function(scout) {
      return ScoutbookDBService.getCurrentRankText(scout);
    }

    _this.getLeadershipRemaining = function(scout) {
      return ScoutbookLeadershipService.getTenureRemaining(scout);
    }

    _this.getNeededService = function(scout) {
      let serviceRequired = '';
      const neededService = ScoutbookActivityService.getScoutServiceNeeededForNextRank(scout);
      if (neededService) {
        if (neededService.total > 0) {
          serviceRequired = `Total: ${neededService.total}`;
        }
        if (neededService.conservation > 0) {
          serviceRequired += ` Conservation: ${neededService.conservation}`
        }
      }
      return serviceRequired;
    }
    _this.getTotalMeritBadges = function(scout) {
      let mbCount = 0;
      if (scout && scout._advancement && scout._advancement._meritBadges) {
        const meritBadges = scout._advancement._meritBadges;
        for (const mbName in meritBadges) {
          const mb = meritBadges[mbName];
          if (mb._completionDate && mb._isApproved === true) {
            mbCount++;
          }
        }
      }
      return mbCount;
    }
    _this.styleBackgroundMb = function(scout) {
      var daysTo18 = _this.daysTo18(scout._dateOfBirth);
      var needMB = _this.needEagleReq(scout, true).length;
      var currentRank = ScoutbookDBService.getCurrentRankText(scout);

      if (daysTo18 < 30 && needMB > 0) {
        return "whiteonblack";
      } else if (daysTo18 >= 30 && daysTo18 < 90 && needMB > 0) {
        return "whiteonred";
      } else if (daysTo18 >= 90 && daysTo18 < 180 && needMB > 0) {
        return "blackonyellow";
      } else if (daysTo18 > 365 && currentRank !== 'Life' && needMB > 10 ) {
        return "blackonyellow";
      }
      return "";
    };

    _this.styleBackgroundDate = function(scout) {
	     var daysTo18 = _this.daysTo18(scout._dateOfBirth);
       var currentRank = ScoutbookDBService.getCurrentRankText(scout);

       if (currentRank === "Life") {
         if (daysTo18 < 182) {
           return "whiteonred";
         } else if (daysTo18 >= 182 && daysTo18 < 365) {
           return "blackonyellow";
         }
      } else {
        return _this.styleBackgroundRank(scout);
      }
    };

    _this.styleBackgroundLdr = function(scout) {
	var daysTo18 = _this.daysTo18(scout._dateOfBirth);
	var ldrDays = ScoutbookLeadershipService.getTenureRemaining(scout);

	if (ldrDays+60 > daysTo18) {
	    return "whiteonred";
	} else if (ldrDays+60 <= daysTo18 && ldrDays+180 > daysTo18) {
	    return "blackonyellow";
	}
	return "";
    };

    _this.styleBackgroundRank = function(scout) {
      var monthsTo18 = _this.monthsTo18(scout._dateOfBirth);
      var daysTo18 = _this.daysTo18(scout._dateOfBirth);
      var ldrDays = ScoutbookLeadershipService.getTenureRemaining(scout);
      var currentRank = ScoutbookDBService.getCurrentRankText(scout);

      if (currentRank === 'First Class' || currentRank === 'Second Class' || currentRank === 'Tenderfoot' || currentRank === 'Scout') {
        if ((monthsTo18 < 12) || (daysTo18 < (365 - ldrDays)) ) {
          return "whiteonblack";
        } else if ((monthsTo18 < 14) || (daysTo18 < (14*30 - ldrDays)) ){
          return "whiteonred";
        } if ((monthsTo18 <= 24) || (daysTo18 < (16*30 - ldrDays)) ){
          return "blackonyellow";
        }
      } else if (currentRank === 'Star') {
        if ((monthsTo18 < 6) || (daysTo18 < (180 - ldrDays)) ) {
          return "whiteonblack";
        } else if ((monthsTo18 < 8) || (daysTo18 < (8*30 - ldrDays)) ){
          return "whiteonred";
        } if ((monthsTo18 < 12) || (daysTo18 < (365 - ldrDays)) ){
          return "blackonyellow";
        }
      }

      return "";
    }

    _this.needEagleReq = function(scout) {
      return EagleRequired.needEagleReq(scout, true);
    };

    _this.olderThanMinAge = function(dob) {
      var rv = false;
      if (dob !== undefined) {
        var minAgeDate = new Date(dob.getTime());
        minAgeDate.setFullYear(minAgeDate.getFullYear()+_this.minAge);
        var now = new Date();
        now.setDate(28);

        if (minAgeDate < now)
          rv = true;
      }
      return rv;
    };

    _this.daysTo18 = function(dob) {
      var eighteen = new Date(dob.getTime());
      eighteen.setFullYear(eighteen.getFullYear()+18);
      var now = new Date();

      var diff = eighteen - now;

      return Math.round((diff)/(1000*3600*24));
    };

    _this.monthsTo18 = function(dob) {
      var eighteen = new Date(dob.getTime());
      eighteen.setFullYear(eighteen.getFullYear()+18);

      var now = new Date();

      return ((eighteen.getFullYear()*12 + eighteen.getMonth()) - (now.getFullYear()*12 + now.getMonth()));
    };
  }]
});
