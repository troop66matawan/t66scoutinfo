var app = angular.module('t66tmweb', ["firebase"]);

app.run(['RankPatchFactory', function(RankPatchFactory) {
  RankPatchFactory.initialize();
}]);

app.component('scoutlist', {
  bindings: {
  },
  controller: function ($scope, $window, $firebaseAuth, activityService, MeetingAttendanceService, ScoutService, ScoutbookDBService, ScoutbookReqtAnalysisService) {
    const _this = this;
    $scope.MeetingAttendanceService = MeetingAttendanceService;
    $scope.ScoutbookDBService = ScoutbookDBService;
    $scope.ScoutbookReqtAnalysisService = ScoutbookReqtAnalysisService;

    _this.scouts = [];
    _this.view = 1;
    _this.menuOptions = [];
    _this.indivScoutDataMenuItem = {name: 'Individual Scout Data', value: 1};
    //_this.trailToEagleReportMenuItem =       {name: 'Trail to Eagle Advancement Report', value: 2};
    _this.photoReportMenuItem = {name: 'Scout Photo Report', value: 3};
    _this.scoutsNotAdvancing = {name: 'Scouts Not Advancing', value: 4};
    _this.exportToScoutbook = {name: 'Export to Scoutbook', value: 5};
    _this.leadershipReport = {name: 'Leadership Attendance Report', value: 6};
    _this.attendanceReport = {name: 'Attendance Report', value: 7};
    _this.serviceReport = {name: 'Service Report', value: 8};
    _this.meetingAttendance = {name: 'Take Meeting Attendance', value: 9};
    _this.rosterReport = {name: 'Roster', value: 10};
    _this.requirementsAnalysis = {name: 'Requirements Analysis', value: 11};
    _this.trailToEagleReportMenuItem2 =       {name: 'Trail to Eagle Advancement Report v2', value: 2};



    var firebaseAuthObject = $firebaseAuth(firebaseauth);
    firebaseAuthObject.$onAuthStateChanged(function(authData) {
      if (authData) {
        // have logged in user, now get accessToken to access database
        authData.getIdToken().then(function(accessToken) {
          _this.getScouts(authData,accessToken);
          activityService.getActivities(authData);
        });
      } else {
        console.log("Logged out");
      }
    });

    _this.getContact = function(scout) {
      var contact;
      if (_this.contacts) {
        contact = ScoutService.getContact(scout, _this.contacts);
      }
      return contact;
    };

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
             MeetingAttendanceService.initDB();
             ScoutbookDBService.initDB()
                 .then(function(scouts) {
                   ScoutbookReqtAnalysisService.initialize();
                   scouts.forEach(function(scout) {
                     ScoutbookReqtAnalysisService.analyze(scout);
                   });
                 });
             _this.position = response.position;
             var allScoutsRef = firedb.ref('scouts/');
             var contactsRef = firedb.ref('scout_contact/');
             allScoutsRef.on('value', function(snapshot) {
               $scope.$apply(function(){
                 _this.menuOptions.push(_this.indivScoutDataMenuItem);
                 _this.menuOptions.push(_this.trailToEagleReportMenuItem2);
                 _this.menuOptions.push(_this.photoReportMenuItem);
                 _this.menuOptions.push(_this.scoutsNotAdvancing);
                 _this.menuOptions.push(_this.exportToScoutbook);
                 _this.menuOptions.push(_this.leadershipReport);
                 _this.menuOptions.push(_this.attendanceReport);
                 _this.menuOptions.push(_this.serviceReport);
                 _this.menuOptions.push(_this.meetingAttendance);
                 _this.menuOptions.push(_this.rosterReport);
                 _this.menuOptions.push(_this.requirementsAnalysis);

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
             contactsRef.on('value', function(snapshot) {
               $scope.$apply(function() {
                 _this.contacts = snapshot.val();
               });
             })
           } else {
             if (response.hasOwnProperty('access')){
               let scoutDataMenu = false;
              for (var scoutIndex in response.access) {
                var scout = response.access[scoutIndex];
                var scoutRef = firedb.ref('scouts/'+scout);
                scoutRef.on('value', function(snapshot) {
                  $scope.$apply(function(){
                    if (scoutDataMenu === false) {
                      _this.menuOptions.push(_this.indivScoutDataMenuItem);
                      scoutDataMenu = true;
                    }
                    _this.scouts.push(snapshot.val());
                    if (_this.scouts && _this.scouts.length > 0) {
                      _this.selected = _this.scouts[0];
                    }
                  });
                });
              }
             }
             if (response.position === 'scribe') {
               $scope.$apply(function() {
                 MeetingAttendanceService.initDB();
                 _this.menuOptions.push(_this.meetingAttendance);
               });
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
      ' in ScoutbookDBService.scouts | orderBy: $ctrl.orderBy()">	</select>' +
      '<scoutdiv scout="$ctrl.selected" ></scoutdiv>'+
    '</div>' +
    '<trailtoeaglereportv2 ng-if="$ctrl.view === 2" scouts="ScoutbookDBService.scouts" min-age="16"></trailtoeaglereportv2>' +
    '<photo-report ng-if="$ctrl.view === 3" scouts="$ctrl.scouts"></photo-report>'+
    '<scoutsnotadvancing ng-if="$ctrl.view === 4" scouts="ScoutbookDBService.scouts"></scoutsnotadvancing>' +
    '<exporttoscoutbook ng-if="$ctrl.view === 5" scouts="$ctrl.scouts"></exporttoscoutbook>' +
    '<leadershipreport ng-if="$ctrl.view === 6" scouts="$ctrl.scouts"></leadershipreport>' +
    '<attendance-report ng-if="$ctrl.view === 7" scouts="$ctrl.scouts"></attendance-report>' +
    '<service-report ng-if="$ctrl.view === 8" scouts="ScoutbookDBService.scouts"></service-report>' +
    '<meeting-attendance ng-if="$ctrl.view === 9"' +
    ' position="$ctrl.position"' +
    ' attendance="MeetingAttendanceService.getMeetingAttendance()"></meeting-attendance>' +
    '<roster-report ng-if="$ctrl.view === 10" scouts="ScoutbookDBService.scouts"></roster-report>' +
    '<requirements-analysis ng-if="$ctrl.view === 11" results="ScoutbookReqtAnalysisService.results"></requirements-analysis>' +
    '<div class="t66footer"><img src="images/Troop%2066%20Logo_trans.png"></div>' +
  '</div>',
  // bindings: {
  //   scouts: '@'
  // }
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
      if (date && date.getFullYear() < 2016) {//2016
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
      '<rankpatch rank="_scout"  advancement="$ctrl.scout._advancement[\'scout\']"></rankpatch>'+
      '<rankpatch rank="_tenderfoot"  advancement="$ctrl.scout._advancement[\'tenderfoot\']"></rankpatch>'+
      '<rankpatch rank="_2ndClass"  advancement="$ctrl.scout._advancement[\'Second Class\']"></rankpatch>'+
      '<rankpatch rank="_1stClass"  advancement="$ctrl.scout._advancement[\'First Class\']"></rankpatch>'+
      '<rankpatch rank="_star"  advancement="$ctrl.scout._advancement[\'Star Scout\']"></rankpatch>'+
      '<rankpatch rank="_life"  advancement="$ctrl.scout._advancement[\'Life Scout\']"></rankpatch>'+
      '<rankpatch rank="_eagle"  advancement="$ctrl.scout._advancement[\'Eagle Scout\']"></rankpatch>'+
    '</div>' +
  '</div>',
  bindings: {
    scout: '='
  },

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
    scout: '=',
    isScoutbook: '<'
  },
  controller: ['EagleRequired', function(EagleRequired) {
    const _this = this;

    _this.needEagleReq = function(scout) {
       return EagleRequired.needEagleReq(scout, _this.isScoutbook);
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
