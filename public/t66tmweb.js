var app = angular.module('t66tmweb', ["firebase"]);

app.component('scoutlist', {
  controller: function ($scope, $window, $firebaseAuth) {
    const _this = this;
    _this.scouts = [];

    var firebaseAuthObject = $firebaseAuth(firebaseauth);
    firebaseAuthObject.$onAuthStateChanged(function(authData) {
      if (authData) {
        // have logged in user, now get accessToken to access database
        authData.getIdToken().then(function(accessToken) {
          _this.getScouts(authData,accessToken);
        });
      } else {
        console.log("Logged out");
      }
    });

     _this.getScouts = function(user, accessToken) {
         //get list of available users
         var usersRef = firedb.ref('users/' + user.uid);
         usersRef.on('value', function(snapshot) {
           var response = snapshot.val();
           if (response.hasOwnProperty('FirstName') && response.hasOwnProperty('LastName')) {
             var displayName = response.FirstName + ' ' + response.LastName;
             document.getElementById('name').textContent = displayName;
           }
           if (response.hasOwnProperty('scoutmaster')) {
             var allScoutsRef = firedb.ref('scouts/');
             allScoutsRef.on('value', function(snapshot) {
               $scope.$apply(function(){
                 _this.scouts = _this.firePropsToArray(snapshot.val());
               });
               console.log(_this.scouts);
             })
           } else {
             if (response.hasOwnProperty('access')){
              for (var scoutIndex in response.access) {
                var scout = response.access[scoutIndex];
                var scoutRef = firedb.ref('scouts/'+scout);
                scoutRef.on('value', function(snapshot) {
                  $scope.$apply(function(){
                    _this.scouts.push(snapshot.val());
                  });
                });
              }
             }
           }
           console.log(snapshot.val());
         })
     }

     _this.firePropsToArray = function(fireprops) {
       var scoutArray = []
       for (var scoutName in fireprops) {
         var scout = fireprops[scoutName];
         scoutArray.push(scout);
       }
       return scoutArray;
     }
    _this.$onInit = function() {
       console.log(_this.scouts);
     };

     _this.genName = function(last,first) {
       return last + ', ' + first;
     }

     _this.orderBy = function() {
       return '_lastName';
     }
  },
  template:
  '<div class="scoutdiv">' +
    '<select ng-model="selected" ng-options="scout as $ctrl.genName(scout._lastName, scout._firstName) for scout in $ctrl.scouts | orderBy: $ctrl.orderBy()">	</select>' +
    '<scoutdiv scout="selected"></scoutdiv>'+
    '<div class="t66footer"><img src="images/Troop%2066%20Logo_trans.png"></div>' +
  '</div>',
  // bindings: {
  //   scouts: '@'
  // }
});

app.component('scoutdiv' , {
  template:
    '<div><scoutinfo scout="$ctrl.scout"></scoutinfo>'+
    '<scoutrank scout="$ctrl.scout"></scoutrank>'+
    '<scoutpor scout="$ctrl.scout"></scoutpor>' +
    '<scoutmb scout="$ctrl.scout"></scoutmb>'+
    '<camping scout="$ctrl.scout"></camping>' +
    '<reportdate scout="$ctrl.scout"></reportdate>' +
    '</div>',
  bindings: {
    scout: '='
  }
});
app.component('scoutdate', {
  template: '<div>{{$ctrl.dateToString($ctrl.date)}}</div>',
  bindings: {
    date: '='
  },
  controller: function() {
    const _this = this;

    _this.dateToString = function(dateObj) {
      if (dateObj ) {
        var month = dateObj.month + 1;
        var day = dateObj.date;
        var year = 1900 + dateObj.year;

        return month + '/' + day + '/' + year;
      }
    }
  }
});

app.component('scoutrank', {
  template:
  '<div class="scoutrank">'+
    '<div class="header">Ranks</div>' +
    '<div class="rank"><div class="label">Scout:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._scout"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">Tenderfoot:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._tenderfoot"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">2nd Class:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._2ndClass"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">1st Class:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._1stClass"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">Star:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._star"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">Life:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._life"></scoutdate></div></div>'+
    '<div class="rank"><div class="label">Eagle:</div><div class="sep"></div><div class="rankdate"><scoutdate date="$ctrl.scout._rankAdvancement._eagle"></scoutdate></div></div>'+
  '</div>',
  bindings: {
    scout: '='
  }
});
app.component('scoutpor', {
  template:
  '<div class="scoutpor">'+
    '<div class="header">Positions of Responsibility</div>' +
    '<div class="por">' +
      '<div class="pors" ng-repeat="por in $ctrl.scout._leadership">' +
        '<position por="por"></position> ' +
      '</div>' +
    '</div>' +
  '</div>',
  bindings: {
    scout: '='
  }
});
app.component('scoutinfo', {
  template:
    '<div><scoutname scout="$ctrl.scout"></scoutname><div class="infobox"> <div class="info label left">BSA ID:</div> <div class="info left">{{$ctrl.scout._bsaID}}</div>' +
    '<div class="info label right">DOB:</div><div class="info"><scoutdate date="$ctrl.scout._dateOfBirth"></scoutdate></div></div></div>',
  bindings: {
    scout: '='
  }
});

app.component('scoutname', {
  template:
    '<div class="scoutname"><div class="firstname">{{$ctrl.scout._firstName}}</div><div class="sep"></div><div class="lastname">{{$ctrl.scout._lastName}}</div></div>',
  bindings: {
    scout: '='
  }
});
app.component('scoutmb', {
  controller: function ($scope) {
     this.mbMap = new Map();
     initmbmap(this.mbMap);

     this.needEagleReq = function() {
       if (!this.scout) {
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
         if (this.scout && this.scout.meritBadges) {
           for (j=0;j<this.scout.meritBadges.length;j++) {
             if (this.scout.meritBadges[j]._name === mb) {
              found = true;
              continue;
              }
            }
         }
         if (!found) {
           need.push(mb);
         }
       }

       var need1 = this.checkEagleOptions(option1, this.scout.meritBadges);
       if (need1 !== '') {
         need.push(need1);
       }
       var need2 = this.checkEagleOptions(option2, this.scout.meritBadges);
       if (need2 !== '') {
         need.push(need2);
       }
       var need3 = this.checkEagleOptions(option3, this.scout.meritBadges);
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
  },  template:
  '<div class="scoutmb">'+
    '<div class="header" >Merit Badges</div>' +
      '<div class="badges">' +
        '<div class="meritbadge" ng-repeat="mb in $ctrl.scout.meritBadges">' +
          '<meritbadge mb="mb"></meritbadge> ' +
        '</div>' +
      '</div>' +
      '<div class="summary">' +
        '<div class="label">Total Merit Badges</div><div class="sep"></div><div class="val">{{$ctrl.scout.meritBadges.length}}</div>' +
      '</div>' +
      '<div class="summary">' +
        '<div class="label">Need Eagle</div><div class="sep"></div><div class="val">{{$ctrl.needEagleReq().length}}</div>'+
      '</div>' +
      '<div class="eagleneeded" ng-repeat="eagle in $ctrl.needEagleReq()">{{eagle}}</div>' +

  '</div>',
  bindings: {
    scout: '='
  }
});
app.component('meritbadge', {
  template:
    '<div class="badge" title="{{$ctrl.mb._name}}">'+
      '<img width="75px" height="75px" src="{{$ctrl.mbimage}}">' +
    '</div>',
  controller: function ($scope) {
    this.$onInit = function() {
      this.mbimage = $scope.$parent.$ctrl.mbMap.get($scope.$ctrl.mb._name);
    };
  },
  bindings: {
    mb: '='
  }
});
app.component('position', {
  template:
    '<div class="position" title="">'+
      '<div class="label">{{$ctrl.por._position}}</div><div class="sep"></div>'+
      '<div class="rankdate"><scoutdate date="$ctrl.por._startDate"></scoutdate></div>'+
      '<span> - </span>' +
      '<div class="rankdate"><scoutdate date="$ctrl.por._endDate"></scoutdate></div>'+
    '</div>',
  bindings: {
    por: '='
  }
});
app.component('camping', {
  controller: function ($scope) {
    this.totalNights = function() {
      var nights=0;
      if (this.scout && this.scout._activities) {
        for (i=0;i<this.scout._activities.length;i++) {
          var amount = parseInt(this.scout._activities[i].amount);
          nights += amount;
        }
      }
      return nights;
    };
  },
  template:
  '<div class="camping">'+
    '<div class="header">Camping</div>' +
    '<div class="table">' +
      '<div class="tr th"><div class="td">Date</div><div class="td">Location</div><div class="td">Remarks</div><div class="td">Nights</div></div>'+
      '<div class="tr" ng-repeat="trip in $ctrl.scout._activities">'+
        '<div class="td"><scoutdate date="trip.activityDate"></scoutdate></div><div class="td">{{trip.location}}</div><div class="td">{{trip.remarks}}</div><div class="td">{{trip.amount}}</div>' +
      '</div>'+
      '<div class="tr"><div class="td"></div><div class="td"></div><div class="td" style="justify-content: flex-end;">Total Nights</div><div class="td">{{$ctrl.totalNights()}}</div></div>' +
      '</div>'+
  '</div>',
  bindings: {
    scout: '='
  }
});
app.component('reportdate', {
  template:
  '<div class="reportdate">'+
    '<span class="label">Report Date: </span>' +
    '<scoutdate date="$ctrl.scout._reportDate"></scoutdate>' +
  '</div>',
  bindings: {
    scout: '='
  }
});
