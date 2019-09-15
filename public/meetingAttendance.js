app.component('meetingAttendance', {
  bindings: {
    attendance: '<'
  },
  templateUrl: 'templates/meetingAttendance.html',
  controller: ['MeetingAttendanceService',MeetingAttendanceController]
});

function MeetingAttendanceController(MeetingAttendanceService) {
  const _this = this;
  _this.sortBy = "_firstName";
  _this.$onInit = function() {
    _this.date = new Date();
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
