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
    '<trailtoeaglereport ng-if="0" scouts="$ctrl.scouts" min-age="16"></trailtoeaglereport>' +
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
    '<service scout="$ctrl.scout"></service>' +
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

        return month + '/ ' + day + '/ ' + year;
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
    '<div class="scoutinfo"><div class="name"><scoutname scout="$ctrl.scout"></scoutname>' +
    ' <scoutimage class="scoutinfoimage" scout="$ctrl.scout"></scoutimage></div><div' +
    ' class="infobox">' +
    ' <div' +
    ' class="info' +
    ' label' +
    ' left">BSA' +
    ' ID:</div> <div class="info left">{{$ctrl.scout._bsaID}}</div>' +
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

app.component('scoutimage', {
  template:
    '<div class="scoutimage"><img id="scoutprofileimage" height="100px" width="100px"' +
    ' src="{{$ctrl.getScoutImage($ctrl.scout._firstName, $ctrl.scout._lastName)}}"></div>',
  bindings: {
    scout: '='
  },
  controller: function ($scope) {
    this.getScoutImage = function(firstName, lastName) {
      var placeholder = 'images/scoutSilhoutte.png';
      var profileImage = {};
      var img = document.getElementById('scoutprofileimage');

      if (firstName !== undefined && lastName !== undefined) {
        var scoutName = firstName + lastName;
        var photoDbRef = firedb.ref('scoutphoto/' + scoutName);
        photoDbRef.once('value', function(snapshot) {
          var pathToPhoto = snapshot.val();
          if (pathToPhoto !== null) {
            var pathRef = firestore.ref(pathToPhoto);
            pathRef.getDownloadURL().then(function(url) {
              // `url` is the download URL for 'images/stars.jpg'
              img.src = url;
              profileImage.url = url;
            })
          } else {
            img.src = placeholder;
          }
        }, function(fail) {
          console.log(fail);
        });
      }
      return placeholder;
    }
  }
});

app.component('eagleneeded', {
  template: '<div class="eagleneeded" ng-repeat="eagle in $ctrl.needEagleReq($ctrl.scout)">{{eagle}}</div>',
  bindings: {
    scout: '='
  },
  controller: ['EagleRequired', function(EagleRequired) {
    const _this = this;

    _this.needEagleReq = function(scout) {
       return EagleRequired.needEagleReq(scout);
    };
   }]
});
app.component('scoutmb', {
  controller: ['EagleRequired', function (EagleRequired) {
     this.mbMap = new Map();
     initmbmap(this.mbMap);

     this.needEagleReq = function(scout) {
       return EagleRequired.needEagleReq(scout);
     }
  }],  template:
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
        '<div class="label">Need Eagle</div><div class="sep"></div><div class="val">{{$ctrl.needEagleReq($ctrl.scout).length}}</div>'+
      '</div>' +
      '<eagleneeded scout="$ctrl.scout"></eagleneeded>' +
  '</div>',
  bindings: {
    scout: '='
  }
});
app.component('meritbadge', {
  template:
    '<div class="badge" title="{{$ctrl.mb._name}}">'+
      '<img width="75px" height="75px" src="{{$ctrl.mbimage}}">' +
      '<span class="mbearneddate"><scoutdate date="$ctrl.mb._earned"></scoutdate></span>' +
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
      '<div class="posdaterange">'+
      '<div class="rankdate"><scoutdate date="$ctrl.por._startDate"></scoutdate></div>'+
      '<span style="margin:auto"> - </span>' +
      '<div class="rankdate"><scoutdate date="$ctrl.por._endDate"></scoutdate></div>'+
      '</div>'+
    '</div>',
  bindings: {
    por: '='
  }
});

app.component('camping', {
  controller: function ($scope) {
    this.totalNights = function() {
      var nights=0;
      if (this.scout && this.scout._camping) {
        for (i=0;i<this.scout._camping.length;i++) {
          var amount = parseInt(this.scout._camping[i].amount);
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
      '<div class="tr" ng-repeat="trip in $ctrl.scout._camping">'+
        '<div class="td"><scoutdate date="trip.activityDate"></scoutdate></div><div class="td">{{trip.location}}</div><div class="td">{{trip.remarks}}</div><div class="td">{{trip.amount}}</div>' +
      '</div>'+
      '<div class="tr"><div class="td"></div><div class="td"></div><div class="td" style="justify-content: flex-end;">Total Nights</div><div class="td">{{$ctrl.totalNights()}}</div></div>' +
      '</div>'+
  '</div>',
  bindings: {
    scout: '='
  }
});

app.component('service', {
  controller: function ($scope) {
    this.totalNights = function() {
      var nights=0;
      if (this.scout && this.scout._service) {
        for (i=0;i<this.scout._service.length;i++) {
          var amount = parseInt(this.scout._service[i].amount);
          nights += amount;
        }
      }
      return nights;
    };
  },
  template:
  '<div class="service">'+
    '<div class="header">Service</div>' +
    '<div class="table">' +
      '<div class="tr th"><div class="td">Date</div><div class="td">Location</div><div class="td">Remarks</div><div class="td">Hours</div></div>'+
      '<div class="tr" ng-repeat="trip in $ctrl.scout._service">'+
        '<div class="td"><scoutdate date="trip.activityDate"></scoutdate></div><div class="td">{{trip.location}}</div><div class="td">{{trip.remarks}}</div><div class="td">{{trip.amount}}</div>' +
      '</div>'+
      '<div class="tr"><div class="td"></div><div class="td"></div><div class="td" style="justify-content: flex-end;">Total Hours</div><div class="td">{{$ctrl.totalNights()}}</div></div>' +
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
