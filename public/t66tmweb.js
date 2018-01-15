var app = angular.module('t66tmweb', ["firebase"]);

app.run(['RankPatchFactory', function(RankPatchFactory) {
  RankPatchFactory.initialize();
}]);

app.component('scoutlist', {
  bindings: {
  },
  controller: function ($scope, $window, $firebaseAuth) {
    const _this = this;
    _this.scouts = [];
    _this.view = 1;
    _this.menuOptions = [
      {name: 'Individual Scout Data', value: 1},
    ];
    _this.trailToEagleReportMenuItem =       {name: 'Trail to Eagle Advancement Report', value: 2};
    _this.photoReportMenuItem = {name: 'Scout Photo Report', value: 3};


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
           if (response.hasOwnProperty('firstName') && response.hasOwnProperty('lastName')) {
             var displayName = response.firstName + ' ' + response.lastName;
             document.getElementById('name').textContent = displayName;
           }
           if (response.hasOwnProperty('position')  &&
                response.position === 'scoutmaster' || response.position === 'eaglecommittee') {
             var allScoutsRef = firedb.ref('scouts/');
             allScoutsRef.on('value', function(snapshot) {
               $scope.$apply(function(){
                 _this.menuOptions.push(_this.trailToEagleReportMenuItem);
                 _this.menuOptions.push(_this.photoReportMenuItem);
                 _this.scouts = _this.firePropsToArray(snapshot.val());

                 _this.scouts.sort(function(a,b) {
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

                 if (_this.scouts && _this.scouts.length > 0) {
                   _this.selected = _this.scouts[0];
                 }
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
                    if (_this.scouts && _this.scouts.length > 0) {
                      _this.selected = _this.scouts[0];
                    }
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
    '<slide-in-menu menu-options="$ctrl.menuOptions" view="$ctrl.view"></slide-in-menu>' +
    '<div ng-if="$ctrl.view ===1">' +
      '<select id="scoutselect" ng-model="$ctrl.selected" ng-options="scout as $ctrl.genName(scout._lastName,' +
  ' scout._firstName)' +
  ' for' +
  ' scout' +
      ' in $ctrl.scouts | orderBy: $ctrl.orderBy()">	</select>' +
      '<scoutdiv scout="$ctrl.selected"></scoutdiv>'+
    '</div>' +
    '<trailtoeaglereport ng-if="$ctrl.view === 2" scouts="$ctrl.scouts" min-age="16"></trailtoeaglereport>' +
    '<photo-report ng-if="$ctrl.view === 3" scouts="$ctrl.scouts"></photo-report>'+
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
    scout: '<'
  },
  controller: [function() {
    const _this = this;
    _this.$onChanges = function(changes) {
      _this.scout = changes.scout.currentValue;
    };

  }]
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

app.factory('RankPatchFactory', function() {
  var rankPatch = {};

  rankPatch.initialize = function() {
    rankPatch.patchMap = new Map();
    rankPatch.patchMap.set("_scout", "images/rank/scout.png");
    rankPatch.patchMap.set("_scout_old", "images/rank/scout_old.jpeg");
    rankPatch.patchMap.set("_tenderfoot", "images/rank/tenderfoot.png");
    rankPatch.patchMap.set("_2ndClass", "images/rank/secondclass.png");
    rankPatch.patchMap.set("_1stClass", "images/rank/firstclass.png");
    rankPatch.patchMap.set("_star", "images/rank/star.png");
    rankPatch.patchMap.set("_life", "images/rank/life.png");
    rankPatch.patchMap.set("_eagle", "images/rank/eagle.jpg");
  };

  rankPatch.getPatchUrl = function(rank,date) {
    var getrank = rank;
    if (rank === "_scout" ) {
      if (date && date.year < 116) {//2016
        getrank += "_old";
      }
    }
    return rankPatch.patchMap.get(getrank);
  };

  return rankPatch;
});
app.component('scoutrank', {
  template:
  '<div class="scoutrank">'+
    '<div class="header">Ranks</div>' +
    '<div class="ranks">'+
      '<rankpatch rank="_scout"  date="$ctrl.scout._rankAdvancement._scout"></rankpatch>'+
      '<rankpatch rank="_tenderfoot"  date="$ctrl.scout._rankAdvancement._tenderfoot"></rankpatch>'+
      '<rankpatch rank="_2ndClass"  date="$ctrl.scout._rankAdvancement._2ndClass"></rankpatch>'+
      '<rankpatch rank="_1stClass"  date="$ctrl.scout._rankAdvancement._1stClass"></rankpatch>'+
      '<rankpatch rank="_star"  date="$ctrl.scout._rankAdvancement._star"></rankpatch>'+
      '<rankpatch rank="_life"  date="$ctrl.scout._rankAdvancement._life"></rankpatch>'+
      '<rankpatch rank="_eagle"  date="$ctrl.scout._rankAdvancement._eagle"></rankpatch>'+
    '</div>' +
  '</div>',
  bindings: {
    scout: '='
  },

});
app.component('rankpatch', {
  template:
  '<div ng-if="$ctrl.isValidDate()" class="rankpatch">'+
   '<img class="rank" ng-src="{{$ctrl.getRankPatch($ctrl.rank,$ctrl.date)}}">' +
   '<span class="rankdate"><scoutdate date="$ctrl.date"></scoutdate></span>'+
  '</div>',
  controller: ['RankPatchFactory', function(RankPatchFactory) {
    const _this = this;
    _this.rpf = RankPatchFactory;

    _this.isValidDate = function() {
      var rv = false;
      if (_this.date && _this.date.time > 0)
        rv = true;
      
      return rv;
    };
    _this.getRankPatch = function(rank,date) {
      return _this.rpf.getPatchUrl(rank,date);
    }
  }],
  bindings: {
    rank: '@',
    date: '<'
  }
});
app.component('scoutpor', {
  template:
  '<div class="scoutpor">'+
    '<div class="header">Positions of Responsibility</div>' +
    '<div class="por">' +
      '<div class="pors" ng-repeat="por in $ctrl.scout._leadership | orderBy: \'_startDate.time\'">' +
        '<position por="por"></position> ' +
      '</div>' +
    '</div>' +
  '</div>',
  bindings: {
    scout: '='
  },
  controller: [function() {
    const _this = this;
    _this.pormap = new Map();

    _this.initpormap = function(pormap){
       pormap.set("Asst SPL", "images/por/aspl.jpg");
       pormap.set("Asst Patrol Ldr", "images/por/asst_patrol_leader.jpg");
       pormap.set("Bugler", "images/por/bugler.jpg");
       pormap.set("Chaplain Aide", "images/por/chaplainaide.jpg");
       pormap.set("Den Chief", "images/por/denchief.jpg");
       pormap.set("Historian", "images/por/historian.jpg");
       pormap.set("Instructor", "images/por/instructor.jpg");
       pormap.set("Inst - First Aid", "images/por/instructor.jpg");
       pormap.set("Inst - Cooking", "images/por/instructor.jpg");
       pormap.set("Junior Asst SM", "images/por/jasm.jpg");
       pormap.set("Librarian", "images/por/librarian.jpg");
       pormap.set("O/A Rep", "images/por/oaTroopRep.jpg");
       pormap.set("Patrol Leader", "images/por/patrol-leader.jpg");
       pormap.set("Quartermaster", "images/por/quartermaster.jpg");
       pormap.set("Scribe", "images/por/scribe.jpg");
       pormap.set("Senior Patrol Ldr", "images/por/seniorpatrolleader.jpg");
       pormap.set("Senior Patrol Ld", "images/por/seniorpatrolleader.jpg");
       pormap.set("Troop Guide", "images/por/troopguide.jpg");
       pormap.set("Troop Webmaster", "images/por/webmaster.jpg");
    };

    _this.initpormap(_this.pormap);
  }]
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
    '<div class="scoutimage"><img ng-attr-id="{{$ctrl.getImgId($ctrl.scout)}}" height="100px" width="100px"' +
    ' ng-src="{{$ctrl.getScoutImage($ctrl.scout)}}"></div>',
  bindings: {
    scout: '='
  },
  controller: function ($scope) {

    this.getImgId = function(scout) {
      if (scout) {
        return scout._firstName + scout._lastName + "scoutprofileimage";
      } else {
        return "scoutprofileimage";
      }
    };

    this.getScoutImage = function(scout) {
      var firstName;
      var lastName;
      var placeholder = 'images/scoutSilhoutte.png';
      var profileImage = {};
      var id = this.getImgId(scout);
      var img = document.getElementById(id);

      if (!img) {
        return;
      }
      if (scout) {
        firstName = scout._firstName;
        lastName = scout._lastName;
      }
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
            if (img) {
              img.src = placeholder;
            }
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
        '<div class="meritbadge" ng-repeat="mb in $ctrl.scout.meritBadges | orderBy: \'_earned.time\'">' +
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
    '<div class="position" title="{{$ctrl.por._position}}">'+
      '<img width="150px" height="150px" ng-src="{{$ctrl.porimage}}">' +
      '<span class="porstartdate"><scoutdate date="$ctrl.por._startDate"></scoutdate></span>'+
      '<span class="porenddate"><scoutdate date="$ctrl.por._endDate"></scoutdate></span>'+
      '</div>'+
    '</div>',
  bindings: {
    por: '='
  },
  controller: function ($scope) {
    this.$onInit = function() {
      this.porimage = $scope.$parent.$ctrl.pormap.get($scope.$ctrl.por._position);
    };
  },
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
