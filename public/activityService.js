angular.module('t66tmweb').service('activityService', function() {
  var _this = this;
  _this.camping = [];
  _this.meeting = [];
  _this.serviceProject = [];

  _this.getActivities = function() {
    var campingRef = firedb.ref('troop_activities/Camping/');
    campingRef.on('value', function(snapshot) {
      _this.camping = _this.firePropsToArray(snapshot.val());
      // sort by activityDate ascending
      _this.camping.sort(function(a,b) {
        return  b.activityDate.time - a.activityDate.time;
      });
    });

    var meetingRef = firedb.ref('troop_activities/Meeting/');
    meetingRef.on('value', function(snapshot) {
      _this.meeting = _this.firePropsToArray(snapshot.val());
      // sort by activityDate ascending
      _this.meeting.sort(function(a,b) {
        return  b.activityDate.time - a.activityDate.time;
      });
    });

    var spRef = firedb.ref('troop_activities/ServiceProject/');
    spRef.on('value', function(snapshot) {
      _this.serviceProject = _this.firePropsToArray(snapshot.val());
      // sort by activityDate ascending
      _this.meeting.sort(function(a,b) {
        return  b.activityDate.time - a.activityDate.time;
      });
    });
  };

  _this.firePropsToArray = function(fireprops) {
    var array = [];
    for (var entry in fireprops) {
      var activity = fireprops[entry];
      array.push(activity);
    }
    return array;
  };

  _this.filterByDate = function(activity, startTime,endTime) {
    var  filteredList = [];
    for (var event in activity) {
      if (activity[event].activityDate.time >= startTime && activity[event].activityDate.time <= endTime) {
        filteredList.push(activity[event]);
      }
    }
    return filteredList;
  };

  _this.getCamping = function(startTime, endTime) {
    return _this.filterByDate(_this.camping,startTime,endTime);
  }
  ;

  _this.getScoutCampingPercentage = function(camping,startTime,endTime) {
    var totalCamping = _this.getCamping(startTime,endTime);
    var scoutTrips = _this.filterByDate(camping,startTime,endTime);
    return scoutTrips.length / totalCamping.length;
  };

  _this.getMeetings = function() {
    return _this.meeting;
  };
  
  _this.getMeeting = function(startTime, endTime) {
    var meeting = [];
    for (var trip in _this.meeting) {
      if (trip.activityDate >= startTime && trip.activityDate <= endTime) {
        meeting.push(trip);
      }
    }
    return meeting;
  };

  _this.getServiceProject = function(startTime, endTime) {
    var serviceProject = [];
    for (var trip in _this.serviceProject) {
      if (trip.activityDate >= startTime && trip.activityDate <= endTime) {
        serviceProject.push(trip);
      }
    }
    return serviceProject;
  };

});
