angular.module('t66tmweb').service('MeetingAttendanceService', MeetingAttendanceService);

function MeetingAttendanceService() {
  const _this = this;

  _this.initDB = function() {
    _this.dbRef = firedb.ref('attendancedb/meetings/');
    _this.dbRef.on('value', function(curSnapshot) {
      _this.meetingAttendance = _this.firePropsToArray(curSnapshot.val());
    });
  };
  _this.firePropsToArray = function(fireprops) {
    const scoutArray = [];
    for (const scoutName in fireprops) {
      if (fireprops.hasOwnProperty(scoutName)) {
        const scout = fireprops[scoutName];
        scoutArray.push(scout);
      }
    }
    return scoutArray;
  };
  /**
   * @description Add new meeting date to all scouts
   * @param date
   */
  _this.newMeeting = function(date) {
    const meeting = {
      date: _this.getMeetingDate(date),
      present: false
    };
    for (let i=0; i < _this.meetingAttendance.length; ++i) {
      const scout = _this.meetingAttendance[i];
      if (scout.meetings === undefined) {
       scout.meetings = [];
      }
      const newMeeting = angular.copy(meeting);
      scout.meetings.push(newMeeting);
    }
    _this.update(_this.meetingAttendance);
  };

  _this.anyScoutsWithMeeting = function(date) {
    let retVal = false;
    for (let i=0; retVal === false && _this.meetingAttendance && i < _this.meetingAttendance.length; ++i) {
      const scout = _this.meetingAttendance[i];
      retVal = (_this.findMeeting(scout,date) !== undefined);
    }
    return retVal;
  };

  _this.getMeetingDate = function(date) {
    return {
      month: date.getMonth(),
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  _this.findMeeting = function(scout, date) {
    let meeting = undefined;
    const meetingDate = _this.getMeetingDate(date);
    if (scout.meetings !== undefined) {
      const index = scout.meetings.findIndex(function(mtg) {
        return (meetingDate.month === mtg.date.month &&
          meetingDate.day === mtg.date.day &&
          meetingDate.year === mtg.date.year)
      });
      if (index > -1) {
        meeting = scout.meetings[index];
      }
    }
    return meeting;
  };

  _this.isScoutAttend = function(scout,date) {
    let retVal = false;
    const meeting = _this.findMeeting(scout,date);
    if (meeting !== undefined) {
      if (meeting.present === true) {
        retVal = true;
      }
    }
    return retVal;
  };

  _this.filterToday = function(meeting) {
    const today = _this.getMeetingDate(new Date());
    return (meeting.date.month === today.month &&
      meeting.date.day === today.day && meeting.date.year === today.year);
  };

  _this.getMeetingAttendance = function() {
    return _this.meetingAttendance;
  };

  _this.update = function(attendenanceArray) {
    const attendance = {};
    for (let i =0; i < attendenanceArray.length; ++i) {
      const scout = angular.copy(attendenanceArray[i]);
      delete scout.$$hashKey;
      const key = scout._firstName + scout._lastName;
      attendance[key] = scout;
    }
    //console.debug(attendance);
    _this.dbRef.set(attendance);
  };
}
