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
  _this.$onInit = function() {
    _this.date = new Date();
    _this.dates = _this.getDates();
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
    return MeetingAttendanceService.anyScoutsWithMeeting(new Date());
  };

  _this.addMeeting = function() {
    MeetingAttendanceService.newMeeting(new Date());
  };

  _this.btnClick = function(scout,date) {
    const meeting = MeetingAttendanceService.findMeeting(scout,date);
    if (meeting !== undefined) {
      meeting.present = !meeting.present;
      MeetingAttendanceService.update(_this.attendance);
    }
  };

  _this.isAttend = function(scout,date) {
    return MeetingAttendanceService.isScoutAttend(scout,date);
  };
}
