app.component('currentrank', {
  bindings: {
    rankadv: '=',
  },
  template: '<div>{{$ctrl.prettyPrint($ctrl.currentRank)}}</div>' ,
  controller: function() {
    const _this = this;

    _this.currentRank = 'none';

    _this.prettyPrint = function() {
      _this.currentRank = undefined;
      if (_this.rankadv) {
        if (_this.rankadv.hasOwnProperty('_eagle')){
          _this.currentRank = 'Eagle';
        } else if (_this.rankadv.hasOwnProperty('_life')){
          _this.currentRank = 'Life';
        } else if (_this.rankadv.hasOwnProperty('_star')){
          _this.currentRank = 'Star';
        } else if (_this.rankadv.hasOwnProperty('_1stClass')){
          _this.currentRank = 'First Class';
        } else if (_this.rankadv.hasOwnProperty('_2ndClass')){
          _this.currentRank = 'Second Class';
        } else if (_this.rankadv.hasOwnProperty('_tenderfoot')){
          _this.currentRank = 'Tenderfoot';
        } else if (_this.rankadv.hasOwnProperty('_scout')){
          _this.currentRank = 'Scout';
        }
        return _this.currentRank;
      }
    };

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
      var neededLeadership=_this.scout._rankAdvancement._neededLeadership;
      var rptDate=_this.scout._reportDate;
      var report = new Date(rptDate.time);
      var now = new Date();

      var diff = now - report;

      var result='';
      if (neededLeadership !== undefined) {
        result = (neededLeadership - Math.round((diff) / (1000 * 3600 * 24)));
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