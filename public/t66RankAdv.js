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
    var rankDate = undefined;
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
  controller: function() {
    const _this = this;

    _this.adjustLeadershipSinceReportDate = function() {
      var result='';
      if (_this.scout && _this.scout._rankAdvancement) {
        var neededLeadership = _this.scout._rankAdvancement._neededLeadership;
        var rptDate = _this.scout._reportDate;
        var report = new Date(rptDate.time);
        var now = new Date();

        var diff = now - report;

        if (neededLeadership !== undefined) {
          result = (neededLeadership - Math.round((diff) / (1000 * 3600 * 24)));
        }
      }
      return result;
    };
  }
});

app.service('EagleRequired', function() {

  this.needEagleReq = function(scout) {
    if (!scout) {
      return;
    }
    var need = new Array();
    var eagles = new Array();
    eagles.push("Camping");
    eagles.push("Cit In Community");
    eagles.push("Cit In Nation");
    eagles.push("Cit In World");
    eagles.push('Communication');
    eagles.push('Cooking');
    eagles.push('Family Life');
    eagles.push('First Aid');
    eagles.push('Personal Fitness');
    eagles.push('Personal Management');

    var option1 = new Array();
    option1.push('Cycling');
    option1.push('Swimming');
    option1.push('Hiking');

    var option2 = new Array();
    option2.push('Environmental Sci');
    option2.push('Sustainability');

    var option3 = new Array();
    option3.push('Emergency Prep');
    option3.push('Lifesaving');



    //eagles.forEach(function(mb) {
    for (i=0;i<eagles.length;i++) {
      mb = eagles[i];
      var found = false;
      if (scout && scout.meritBadges) {
        for (j=0;j<scout.meritBadges.length;j++) {
          if (scout.meritBadges[j]._name === mb) {
            found = true;
            continue;
          }
        }
      }
      if (!found) {
        need.push(mb);
      }
    }

    var need1 = this.checkEagleOptions(option1, scout.meritBadges);
    if (need1 !== '') {
      need.push(need1);
    }
    var need2 = this.checkEagleOptions(option2, scout.meritBadges);
    if (need2 !== '') {
      need.push(need2);
    }
    var need3 = this.checkEagleOptions(option3, scout.meritBadges);
    if (need3 !== '') {
      need.push(need3);
    }
    return need;
  }

  this.checkEagleOptions = function(optionSet, mbs) {
    var need='';
    var found = false;

    if (mbs) {
      for (i=0;i<optionSet.length;i++) {
        option = optionSet[i];
        for (j=0;j<mbs.length;j++) {
          if (mbs[j]._name === option)
            found = true;
          continue;
        }
      }
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