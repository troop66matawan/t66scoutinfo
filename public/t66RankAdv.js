app.component('currentrank', {
  bindings: {
    rankadv: '=',
  },
  template: '<div>{{$ctrl.prettyPrint()}}</div>' ,
  controller: ['RankAdvancement', function(RankAdvancement) {
    const _this = this;

    _this.prettyPrint = function() {
      return RankAdvancement.getCurrentRankText(_this.rankadv);
    };
  }]
});

app.service('RankAdvancement', function() {

  this.getCurrentRankText = function(rankadv) {
    var rankDate = '';
    if (rankadv) {
      if (rankadv.hasOwnProperty('_eagle')){
        rankDate = 'Eagle';
      } else if (rankadv.hasOwnProperty('_life')){
        rankDate = 'Life';
      } else if (rankadv.hasOwnProperty('_star')){
        rankDate = 'Star';
      } else if (rankadv.hasOwnProperty('_1stClass')){
        rankDate = 'First Class';
      } else if (rankadv.hasOwnProperty('_2ndClass')){
        rankDate = 'Second Class';
      } else if (rankadv.hasOwnProperty('_tenderfoot')){
        rankDate = 'Tenderfoot';
      } else if (rankadv.hasOwnProperty('_scout')){
        rankDate = 'Scout';
      }
      return rankDate;
    }
  };

  this.getCurrentRankDate = function(rankadv) {
    var rankDate = undefined;
    if (rankadv) {
      if (rankadv.hasOwnProperty('_eagle')){
        rankDate = rankadv._eagle;
      } else if (rankadv.hasOwnProperty('_life')){
        rankDate = rankadv._life;
      } else if (rankadv.hasOwnProperty('_star')){
        rankDate = rankadv._star;
      } else if (rankadv.hasOwnProperty('_1stClass')){
        rankDate = rankadv._1stClass;
      } else if (rankadv.hasOwnProperty('_2ndClass')){
        rankDate = rankadv._2ndClass;
      } else if (rankadv.hasOwnProperty('_tenderfoot')){
        rankDate = rankadv._tenderfoot;
      } else if (rankadv.hasOwnProperty('_scout')){
        rankDate = rankadv._scout;
      }
    }
    return rankDate;
  };
});


app.component('currentrankdate', {
  bindings: {
    rankadv: '=',
  },
  template: '<div><scoutdate date="{{$ctrl.currentRankDate()}}"></div>' ,
  controller: function() {
    const _this = this;



  }
});

app.component('leadershipneeded', {
  bindings: {
    scout: '=',
  },
  template: '<div>{{$ctrl.adjustLeadershipSinceReportDate()}}</div>' ,
  controller: function(porService) {
    const _this = this;

    _this.adjustLeadershipSinceReportDate = function() {
      var result='';
      if (_this.scout && _this.scout._rankAdvancement) {
        var neededLeadership = _this.scout._rankAdvancement._neededLeadership;
        result = neededLeadership;
        if (_this.scout._leadership && _this.scout._leadership.length > 0 ) {
          _this.scout._leadership.forEach(function(por) {
            if (porService.isPositionForRank(por._position) &&
            porService.isCurrentPosition(_this.scout._reportDate, por._endDate)) {
              var rptDate = _this.scout._reportDate;
              var report = new Date(rptDate.time);
              var now = new Date();

              var diff = now - report;

              if (neededLeadership !== undefined) {
                result = (neededLeadership - Math.round((diff) / (1000 * 3600 * 24)));
              }
            }
          })
        }
      }
      return result;
    };
  }
});

app.service('EagleRequired', function() {
  const TROOPMASTER_EAGLES = [
    'Camping',
    'Cit In Community',
    'Cit In Nation',
    'Cit In World',
    'Communication',
    'Cooking',
    'Family Life',
    'First Aid',
    'Personal Fitness',
    'Personal Management',
  ];
  const SCOUTBOOK_EAGLES = [
    'Camping',
    'Citizenship in the Community',
    'Citizenship in the Nation',
    'Citizenship in the World',
    'Communication',
    'Cooking',
    'Family Life',
    'First Aid',
    'Personal Fitness',
    'Personal Management',
  ];

  this.needEagleReq = function(scout, isScoutbook) {
    if (!scout) {
      return;
    }
    var need = new Array();
    let eagles;
    if (isScoutbook) {
      eagles = SCOUTBOOK_EAGLES;
    } else {
      eagles = TROOPMASTER_EAGLES;
    }

    var option1 = new Array();
    option1.push('Cycling');
    option1.push('Swimming');
    option1.push('Hiking');

    var option2 = new Array();
    if (isScoutbook) {
      option2.push('Environmental Science')
    } else {
      option2.push('Environmental Sci');
    }
    option2.push('Sustainability');

    var option3 = new Array();
    if (isScoutbook) {
      option3.push('Emergency Preparedness');
    } else {
      option3.push('Emergency Prep');
    }
    option3.push('Lifesaving');



    //eagles.forEach(function(mb) {
    for (i=0;i<eagles.length;i++) {
      mb = eagles[i];
      var found = this.matchMeritBadges(mb, scout, isScoutbook);

      if (!found) {
        need.push(mb);
      }
    }

    var need1 = this.checkEagleOptions(option1, scout, isScoutbook);
    if (need1 !== '') {
      need.push(need1);
    }
    var need2 = this.checkEagleOptions(option2, scout, isScoutbook);
    if (need2 !== '') {
      need.push(need2);
    }
    var need3 = this.checkEagleOptions(option3, scout, isScoutbook);
    if (need3 !== '') {
      need.push(need3);
    }
    return need;
  }

  this.matchMeritBadges = function(mb, scout, isScoutbook) {
    if (isScoutbook) {
      if (scout && scout._advancement && scout._advancement._meritBadges && scout._advancement._meritBadges.hasOwnProperty(mb)) {
        const meritbadge = scout._advancement._meritBadges[mb];
        if (meritbadge._isApproved) {
          return true;
        }
      }
    } else {
      if (scout && scout.meritBadges) {
        for (j=0;j<scout.meritBadges.length;j++) {
          if (scout.meritBadges[j]._name === mb) {
            return true;
          }
        }
      }
    }
    return false;
  }
  this.checkEagleOptions = function(optionSet, scout, isScoutbook) {
    var need='';
    var found = false;

    for (let i=0;(i<optionSet.length && !found);i++) {
      const option = optionSet[i];
      found = this.matchMeritBadges(option,scout, isScoutbook);
    }
    if (found == false) {
      for (i=0;i<optionSet.length;i++) {
        need += optionSet[i];
        if (i+1 < optionSet.length) {
          need += " or ";
        }
      }
    }
    return need;
  }

});
