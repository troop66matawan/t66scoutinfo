app.component('attendanceReport', {
  bindings: {
    scouts: '<'
  },
  templateUrl: 'templates/attendanceReport.html',
  controller: ['activityService',AttendanceReportController]
});

function AttendanceReportController(activityService) {

  this.$onInit = function() {
    this.meetings = activityService.getMeetings();
  };

  this.genDate = function(activityDate) {
    if (activityDate !== undefined && activityDate.hasOwnProperty('month') &&
      activityDate.hasOwnProperty('date') && activityDate.hasOwnProperty('year')) {
      return (activityDate.month + 1) + '/' + activityDate.date + '/' + (activityDate.year + 1900);
    } else {
      return '';
    }
  };

  this.isScoutAttend = function(scout,meeting) {
    if (scout._meeting === undefined) {
      return false;
    } else {
      return (scout._meeting.some(attendMeeting => (
        attendMeeting.activityDate.month === meeting.activityDate.month &&
        attendMeeting.activityDate.date === meeting.activityDate.date &&
        attendMeeting.activityDate.year === meeting.activityDate.year)));
    }
  }
}
