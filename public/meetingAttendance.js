app.component('meetingAttendance', {
  bindings: {
    attendance: '<',
    position: '<'
  },
  templateUrl: 'templates/meetingAttendance.html',
  controller: ['MeetingAttendanceService',MeetingAttendanceController]
});

function MeetingAttendanceController(MeetingAttendanceService) {
  const _this = this;
  _this.sortBy = "_firstName";
  _this.groupByPatrol = false;
  _this.$onInit = function() {
    _this.recordedBy = document.getElementById('name').textContent;
    _this.patrols = MeetingAttendanceService.getMeetingDbPatrols();
    if (_this.attendance) {
      _this.attendance.forEach(function (scout) {
        scout._patrol = MeetingAttendanceService.getPatrolForScout(scout);
      });
    }
    _this.date = new Date();
    _this.dates = _this.getDates();
    _this.showSetup = false;
    _this.overrideWed = false;
  };

  _this.getDates = function() {
    const dates = [];
    const dateMap = new Map();
    for (let i=0; _this.attendance !== undefined && i < _this.attendance.length; ++i) {
      const scout = _this.attendance[i];
      for (let m=0; scout.meetings !== undefined && m < scout.meetings.length; ++m) {
        const meeting = scout.meetings[m];
        const meetingDate = new Date(meeting.date.year, meeting.date.month, meeting.date.day, 0,0, 0, 0);
        if (dateMap.get(meetingDate.getTime()) === undefined) {
          dateMap.set(meetingDate.getTime(), meeting);
        }
      }
    }
    for (const meeting of dateMap.keys()) {
      dates.push(meeting);
    }
    dates.sort(function(a,b) {
      return b - a;
    });
    return dates;
  };
  this.genDate = function(activityDate) {
    if (activityDate !== undefined ) {
      const date = new Date(activityDate);
      return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  };
  this.setDate = function() {
    _this.date = new Date(_this.selected);
  };
  _this.haveMeeting = function() {
    return MeetingAttendanceService.anyScoutsWithMeeting(_this.date);
  };

  /* meetings moving to Sunday - change day of week */
  _this.isWed = function() {
    let wed = false;
    const dayOfWeek = new Date().getDay();
//    if (dayOfWeek === 3) { // Wednesday
    if (dayOfWeek === 0) { // Sunday
      wed = true;
    }
    if (_this.overrideWed === true) {
      wed = true;
    }
    return wed;
  };

  _this.addMeeting = function() {
    MeetingAttendanceService.newMeeting(new Date());
  };

  _this.btnClick = function(scout,date) {
    if (_this.isWed()) {
      const meeting = MeetingAttendanceService.findMeeting(scout, date);
      if (meeting !== undefined) {
        meeting.present = !meeting.present;
        if (meeting.present) {
          meeting.recordedBy =  _this.recordedBy;
        }
        MeetingAttendanceService.update(_this.attendance);
      }
    }
  };

  _this.isAttend = function(scout,date) {
    return MeetingAttendanceService.isScoutAttend(scout,date);
  };
}
