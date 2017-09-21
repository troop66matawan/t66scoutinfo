app.component('trailtoeaglereport', {
  bindings : {
    scouts: '<',
    minAge: '<'
  },
  template:   '<div class="trailtoeagle">'+
  '<div class="header">Trail to Eagle Advancement Report</div>' +
  '<div class="table">' +
  '<div class="tr th">'+'' +
    //		return "Last Name, First Name, Rank, Birthday,Months to 18,Leadership Remaining,Total Merit Badges,Count of remaining Eagle Badges, Remaining Eagle Required Badges";

    '<div class="td">Last name</div><div class="td">First Name</div><div class="td">Rank</div>'+'' +
    '<div class="td">Birthday</div><div class="td">Months to 18</div><div class="td">Leadership Remaining</div>'+
    '<div class="td">Total Merit Badges</div><div class="td"># Eagle remaining</div>'+'' +
    '<div class="td">Eagle MB Remaining</div>'+
  '</div>'+
  '<div class="tr" ng-repeat="scout in $ctrl.trailToEagleScouts">'+
    '<div class="td">{{scout._lastName}}</div><div class="td">{{scout._firstName}}</div>'+'' +
    '<div class="td"><currentrank rankadv="scout._rankAdvancement"></currentrank></div>'+
    '<div class="td"><scoutdate date="scout._dateOfBirth"></scoutdate></div>' +
    '<div class="td">{{$ctrl.monthsTo18(scout._dateOfBirth)}}</div>' +
    '<div class="td"></div>'+
    '<div class="td">{{scout.meritBadges.length}}</div><div class="td">{{$ctrl.needEagleReq(scout).length}}</div>' +
    '<div class="td"><eagleneeded scout="scout"></eagleneeded></div>' +
  '</div>'+
  '</div>'+
  '</div>',
  controller: ['EagleRequired', function(EagleRequired) {
    const _this = this;
    _this.trailToEagleScouts = [];

    _this.$onChanges = function(changes) {
      _this.scouts =  changes.scouts.currentValue;
      var numberOfTrailToEagleScouts = 0;
      _this.scouts.forEach(function(scout) {
        var rank = scout._rankAdvancement;
        var dob = scout._dateOfBirth;
        if ( (!rank.hasOwnProperty('_eagle')) && (rank.hasOwnProperty('_life')  || (!rank.hasOwnProperty('_life') &&
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

    _this.monthsTo18 = function(dob) {
      var eighteen = new Date(dob.time);
      eighteen.setFullYear(eighteen.getFullYear()+18);

      var now = new Date();

      return ((eighteen.getFullYear()*12 + eighteen.getMonth()) - (now.getFullYear()*12 + now.getMonth()));
    };
  }]
});