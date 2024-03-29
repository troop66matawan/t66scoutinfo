angular.module('t66tmweb').component('scoutpor', {
  template:
  '<div class="scoutpor">'+
  '<div class="header">Positions of Responsibility</div>' +
  '<div class="por">' +
  '<div ng-if="$ctrl.scout._leadership && $ctrl.scout._leadership._positions"' +
      'class="pors" ng-repeat="por in $ctrl.scout._leadership._positions | orderBy: \'_startDate.time\'">' +
  '<position por="por" scout="$ctrl.scout"></position> ' +
  //'<porcampingpercent por="por" scout="$ctrl.scout"></porcampingpercent>' +
  '</div>' +
  '</div>' +
  '</div>',
  bindings: {
    scout: '='
  },
});

angular.module('t66tmweb').component('position', {
  template:
  '<div class="position" title="{{$ctrl.por._position}}">'+
  '<img width="150px" height="150px" ng-src="{{$ctrl.porimage}}">' +
  '<span class="porstartdate"><date date="$ctrl.por._startDate"></date></span>'+
  '<span class="porenddate"><date date="$ctrl.por._endDate"></date></span>'+
  '</div>',
  bindings: {
    por: '=',
    scout: '='
  },
  controller: function ($scope,activityService,porService) {
    this.$onInit = function() {
      this.porimage = porService.getPoRImage($scope.$ctrl.por._position);
    };
  },
});
angular.module('t66tmweb').component('porcampingpercent', {
  template:
  '<div class="porcampingpercent">'+
  '<div><span class="label">Camping %</span><span class="value">{{$ctrl.campingpercent}}</span></div>'+
  '</div>',
  bindings: {
    por: '=',
    scout: '='
  },
  controller: function ($scope,activityService,porService) {
    this.$onInit = function() {
      this.campingpercent = Math.trunc(100 * activityService.getScoutCampingPercentage($scope.$ctrl.scout._camping,
        $scope.$ctrl.por._startDate.time,
        $scope.$ctrl.por._endDate.time));
    };
  },
});

angular.module('t66tmweb').service('porService', function() {
  const _this = this;
  _this.pormap = new Map();

  _this.initpormap = function(pormap){
    pormap.set("Asst SPL", {image: "images/por/aspl.jpg", camping: 75, meeting: 75, forRank: true });
    pormap.set("Assistant Senior Patrol Leader", {image: "images/por/aspl.jpg", camping: 75, meeting: 75, forRank: true });
    pormap.set("Asst Patrol Ldr", {image:"images/por/asst_patrol_leader.jpg", camping: 0, meeting: 0, forRank: false });
    pormap.set("Assistant Patrol Leader", {image:"images/por/asst_patrol_leader.jpg", camping: 0, meeting: 0, forRank: false });
    pormap.set("Bugler", {image:"images/por/bugler.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Chaplain Aide", {image:"images/por/chaplainaide.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Den Chief", {image:"images/por/denchief.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Historian", {image:"images/por/historian.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Instructor", {image:"images/por/instructor.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Inst - First Aid", {image:"images/por/instructor.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Inst - Cooking", {image:"images/por/instructor.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Junior Asst SM", {image:"images/por/jasm.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Junior Assistant Scoutmaster", {image:"images/por/jasm.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Librarian", {image:"images/por/librarian.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("O/A Rep", {image:"images/por/oaTroopRep.jpg", camping: 75, meeting: 75, forRank: true  });
    pormap.set("OA Unit Representative", {image:"images/por/oaTroopRep.jpg", camping: 75, meeting: 75, forRank: true  });
    pormap.set("Patrol Leader", {image:"images/por/patrol-leader.jpg", camping:75, meeting: 75, forRank: true });
    pormap.set("Quartermaster", {image:"images/por/quartermaster.jpg", camping: 80, meeting: 65, forRank: true });
    pormap.set("Scribe", {image:"images/por/scribe.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Senior Patrol Ldr", {image: "images/por/seniorpatrolleader.jpg", camping: 80,  meeting: 80,forRank: true});
    pormap.set("Senior Patrol Leader", {image: "images/por/seniorpatrolleader.jpg", camping: 80,  meeting: 80,forRank: true});
    pormap.set("Senior Patrol Ld", {image: "images/por/seniorpatrolleader.jpg", camping: 80,  meeting: 80,forRank: true});
    pormap.set("Troop Guide", {image: "images/por/troopguide.jpg", camping: 65,  meeting: 65,forRank: true });
    pormap.set("Troop Webmaster", {image:"images/por/webmaster.jpg", camping: 65,  meeting: 65,forRank: true });
    pormap.set("Webmaster", {image:"images/por/webmaster.jpg", camping: 65,  meeting: 65,forRank: true });
    pormap.set("Food Pantry Coord", {image:"images/por/foodPantry.jpg", camping: 65, meeting: 65, forRank: true });
    pormap.set("Food Pantry Coor", {image:"images/por/foodPantry.jpg", camping: 65,  meeting: 65,forRank: true });
    pormap.set("Community Svc Coord", {image:"images/por/comSvcPOR.jpg", camping: 65,  meeting: 65,forRank: true });
  };

  _this.isCurrentPosition = function(reportDate,posEndDate) {
    var rv = false;
    function timeToDate(time) {
      var date = new Date(time);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    }
    var reportTime = timeToDate(reportDate.time);
    var posTime = timeToDate(posEndDate.time);

    if (posTime.getTime() === reportTime.getTime()) {
      rv = true;
    }
    return rv;
  };

  _this.initpormap(_this.pormap);

  _this.getTrimmedName = function(porName) {
    if (porName.startsWith('Patrol Leader')) {
      return 'Patrol Leader';
    }
    if (porName.startsWith('Assistant Patrol Leader')) {
      return 'Assistant Patrol Leader';
    }
    if (porName.startsWith('Troop Guide')) {
      return 'Troop Guide';
    }
    return porName;
  }
  _this.getPoRImage = function(porName) {

    return _this.pormap.get(_this.getTrimmedName(porName)).image;
  };

  _this.getExpectedCampingAttendance = function(porName) {
    return _this.pormap.get(_this.getTrimmedName(porName)).camping;
  };

  _this.getExpectedMeetingPercent = function(porName) {
    return _this.pormap.get(_this.getTrimmedName(porName)).meeting;
  }

  _this.isPositionForRank = function(porName) {
    var rv = false;
    var pos = _this.pormap.get(_this.getTrimmedName(porName));
    if (pos && pos.forRank) {
      rv = true;
    }
    return rv;
  }
});
