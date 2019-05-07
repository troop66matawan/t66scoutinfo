app.component('trailtoeaglereport', {
  bindings : {
    scouts: '<',
    minAge: '<'
  },
  templateUrl: 'templates/trailToEagleReport.html',
  controller: ['EagleRequired','RankAdvancement', function(EagleRequired,RankAdvancement) {
    const _this = this;
    _this.trailToEagleScouts = [];

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      var numberOfTrailToEagleScouts = 0;
      _this.scouts.forEach(function(scout) {
        var rank = scout._rankAdvancement;
        var dob = scout._dateOfBirth;
        if ( rank && (!rank.hasOwnProperty('_eagle')) && (rank.hasOwnProperty('_life')  || (!rank.hasOwnProperty('_life') &&
             (_this.olderThanMinAge(dob)))))
        {
          _this.trailToEagleScouts.push(scout);
          ++numberOfTrailToEagleScouts;
        }
      });

      // sort by birthday descending
      _this.trailToEagleScouts.sort(function(a,b) {
        return  a._dateOfBirth.time - b._dateOfBirth.time;
      });
    }

    _this.styleBackgroundMb = function(scout) {
      var daysTo18 = _this.daysTo18(scout._dateOfBirth);
      var needMB = _this.needEagleReq(scout).length;

      if (daysTo18 < 30 && needMB > 0) {
        return "whiteonblack";
      } else if (daysTo18 >= 30 && daysTo18 < 90 && needMB > 0) {
        return "whiteonred";
      } else if (daysTo18 >= 90 && daysTo18 < 180 && needMB > 0) {
        return "blackonyellow";
      }
      return "";
    };

    _this.styleBackgroundDate = function(scout) {
	     var daysTo18 = _this.daysTo18(scout._dateOfBirth);
       var currentRank = RankAdvancement.getCurrentRankText(scout._rankAdvancement);

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
	var ldrDays = scout._rankAdvancement._neededLeadership;

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
      var ldrDays = scout._rankAdvancement._neededLeadership;
      var currentRank = RankAdvancement.getCurrentRankText(scout._rankAdvancement);

      if (currentRank === 'First Class' || currentRank === 'Second Class' || currentRank === 'Tenderfoot' || currentRank === 'Scout') {
        if ((monthsTo18 < 12) || (daysTo18 < (365 - ldrDays)) ) {
          return "whiteonblack";
        } else if ((monthsTo18 < 14) || (daysTo18 < (14*30 - ldrDays)) ){
          return "whiteonred";
        } if ((monthsTo18 < 16) || (daysTo18 < (16*30 - ldrDays)) ){
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
      return EagleRequired.needEagleReq(scout);
    };

    _this.olderThanMinAge = function(dob) {
      var rv = false;
      var minAgeDate = new Date(dob.time);
      minAgeDate.setFullYear(minAgeDate.getFullYear()+_this.minAge);
      var now = new Date();

      if (minAgeDate < now)
        rv = true;

      return rv;
    };

    _this.daysTo18 = function(dob) {
      var eighteen = new Date(dob.time);
      eighteen.setFullYear(eighteen.getFullYear()+18);
      var now = new Date();

      var diff = eighteen - now;

      return Math.round((diff)/(1000*3600*24));
    };

    _this.monthsTo18 = function(dob) {
      var eighteen = new Date(dob.time);
      eighteen.setFullYear(eighteen.getFullYear()+18);

      var now = new Date();

      return ((eighteen.getFullYear()*12 + eighteen.getMonth()) - (now.getFullYear()*12 + now.getMonth()));
    };
  }]
});
