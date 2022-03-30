angular.module('t66tmweb')
    .service('ScoutbookDBService', ['ScoutbookDBConstant', '$q', ScoutbookDBService])
    .constant('ScoutbookDBConstant', {
        ADVANCEMENT: {
            SCOUT: 'scout',
            TENDERFOOT: 'tenderfoot',
            SECOND_CLASS: 'Second Class',
            FIRST_CLASS: 'First Class',
            STAR: 'Star Scout',
            LIFE: 'Life Scout',
            EAGLE: 'Eagle Scout'
        }
    });

function ScoutbookDBService(ScoutbookDBConstant, $q) {
    const _this = this;
    _this.initDB = function() {
        const defer = $q.defer();
        _this.dbRef = firedb.ref('scoutbookDb');
        _this.dbRef.on('value', function(curSnapshot) {
            _this.scouts = _this.firePropsToArray(curSnapshot.val());
            console.log(_this.scouts);
            defer.resolve(_this.scouts);
        });
        return defer.promise;
    };
    _this.initCalendar = function() {
        const defer = $q.defer();
        _this.calendarRef = firedb.ref('scoutbookCal');
        _this.calendarRef.on('value', function(curSnapshot) {
            _this.calendar = curSnapshot.val();
            defer.resolve(_this.calendar);
        });
        return defer.promise;
    }
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

    _this.getDate = function(scoutbookDate) {
        let date;
        if (scoutbookDate) {
            let splits = scoutbookDate.split('/');
            if (splits.length === 3) {
                date = new Date(splits[2], splits[0] - 1, splits[1]);
            } else {
                splits = scoutbookDate.split('-');
                if (splits.length === 3) {
                    date = new Date(splits[0], splits[1] - 1, splits[2]);
                }
            }
        }
        return date;
    };
    /**
     * @function getPatols
     * @param {Array} scouts - array of scouts
     * @returns {Array} array of patrol names
     */
    _this.getPatrols = function(scouts) {
        var patrols = [];

        for (var i=0; (scouts instanceof Array) && i < scouts.length; ++i) {
            var patrolName = scouts[i]._patrolName;
            if (patrolName !== undefined && patrols.indexOf(patrolName) === -1) {
                patrols.push(patrolName);
            }
        }
        return patrols;
    };

    _this.getContact = function(scout) {
        let contact = scout._contactInfo;
        if (contact === undefined) {
            contact = scout;
        }
        return contact;
    }

    _this.getRankObj = function(scout, rank) {
        let currank;
        if (scout && scout._advancement && scout._advancement.hasOwnProperty(rank) ) {
            currank = scout._advancement[rank];
        }
        return currank;
    };

    _this.getActiveScouts = function(scouts) {
        let activeScouts = [];
        for (let i=0; (scouts instanceof Array) && i < scouts.length; ++i) {
            let patrolName = scouts[i]._patrolName;
            if (patrolName !== 'Inactive' && patrolName !== 'AgedOut' && patrolName !== undefined) {
                activeScouts.push(scouts[i]);
            }
        }
        return activeScouts;
    }

    _this.getInactiveScouts = function(scouts) {
        let inactiveScouts = [];
        for (let i=0; (scouts instanceof Array) && i < scouts.length; ++i) {
            let patrolName = scouts[i]._patrolName;
            if (patrolName === 'Inactive' || patrolName === 'AgedOut') {
                inactiveScouts.push(scouts[i]);
            }
        }
        return inactiveScouts;
    }
    /**
     *
     * @param scout - Scout Object
     * @param rank - Rank String
     * @returns {Date}
     */
    _this.getRankDate = function(scout, rank) {
        let rankDate;
        const curRank = _this.getRankObj(scout,rank);
        if (curRank && curRank._isApproved) {
            rankDate = new Date(curRank._completionDate);
        }
        return rankDate;
    };

    _this.getCurrentRank = function(scout) {
        var rank;
        if (scout && scout._advancement) {
            const rankadv = scout._advancement;
            if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.EAGLE) && rankadv[ScoutbookDBConstant.ADVANCEMENT.EAGLE]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.EAGLE;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.LIFE) && rankadv[ScoutbookDBConstant.ADVANCEMENT.LIFE]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.LIFE;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.STAR) && rankadv[ScoutbookDBConstant.ADVANCEMENT.STAR]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.STAR;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS) && rankadv[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS) && rankadv[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT) && rankadv[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT;
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.SCOUT) && rankadv[ScoutbookDBConstant.ADVANCEMENT.SCOUT]._isApproved){
                rank = ScoutbookDBConstant.ADVANCEMENT.SCOUT;
            }
        }
        return rank;
    }
    _this.getNextRank = function(scout) {
        var rank= ScoutbookDBConstant.ADVANCEMENT.SCOUT;
        const curRank = _this.getCurrentRank(scout);
        if (curRank){
            switch (curRank) {
                case ScoutbookDBConstant.ADVANCEMENT.SCOUT:
                    rank = ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT;
                    break;
                case ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT:
                    rank = ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS;
                    break;
                case ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS:
                    rank = ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS;
                    break;
                case ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS:
                    rank = ScoutbookDBConstant.ADVANCEMENT.STAR;
                    break;
                case ScoutbookDBConstant.ADVANCEMENT.STAR:
                    rank = ScoutbookDBConstant.ADVANCEMENT.LIFE;
                    break;
                case ScoutbookDBConstant.ADVANCEMENT.LIFE:
                case ScoutbookDBConstant.ADVANCEMENT.EAGLE:
                    rank = ScoutbookDBConstant.ADVANCEMENT.EAGLE;
                    break;
                default:
                    break;
            }
        }
        return rank;
    }
    _this.getCurrentRankText = function(scout) {
        var rankText = '';
        if (scout && scout._advancement) {
            const rankadv = scout._advancement;
            if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.EAGLE) && rankadv[ScoutbookDBConstant.ADVANCEMENT.EAGLE]._isApproved){
                rankText = 'Eagle';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.LIFE) && rankadv[ScoutbookDBConstant.ADVANCEMENT.LIFE]._isApproved){
                rankText = 'Life';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.STAR) && rankadv[ScoutbookDBConstant.ADVANCEMENT.STAR]._isApproved){
                rankText = 'Star';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS) && rankadv[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS]._isApproved){
                rankText = 'First Class';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS) && rankadv[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS]._isApproved){
                rankText = 'Second Class';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT) && rankadv[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT]._isApproved){
                rankText = 'Tenderfoot';
            } else if (rankadv.hasOwnProperty(ScoutbookDBConstant.ADVANCEMENT.SCOUT) && rankadv[ScoutbookDBConstant.ADVANCEMENT.SCOUT]._isApproved){
                rankText = 'Scout';
            }
        }
        return rankText;
    };
    _this.getRequirement = function(rankObj, requirementID) {
        let requirement;
        if (rankObj && rankObj._requirements && rankObj._requirements._requirement) {
           requirement = rankObj._requirements._requirement[requirementID];
        }
        return requirement;
    }
    _this.getCamping = function(scout) {
        let camping;
        if (scout && scout._activities && scout._activities._camping) {
            camping = scout._activities._camping;
        }
        return camping;
    };
    _this.getService = function(scout) {
        let service;
        if (scout && scout._activities && scout._activities._service) {
            service = scout._activities._service;
        }
        return service;
    };
    _this.getCalendarKey = function(scout) {
        if (scout) {
            let firstName = scout._nickname;
            if (firstName === undefined || firstName && firstName.length === 0) {
                firstName = scout._firstName;
            }
            return `${firstName} ${scout._lastName}`;
        } else {
            return '';
        }
    }
    _this.getCampingPercent = function(scout) {
        let campingPercent = 0;
        const totalCamping = _this.calendar.camping.length;
        const scoutKey = _this.getCalendarKey(scout);
        const scoutAttend = _this.calendar.attendance[scoutKey];
        if (scoutAttend && scoutAttend.camping) {
            const attendCamping = scoutAttend.camping.length;
            campingPercent = attendCamping/totalCamping ;
        }
        return Math.round(campingPercent * 100);
    };
    
    _this.getMeetingPercent = function(scout) {
        let meetingPercent = 0;
        const totalMeeting = _this.calendar.meeting.length;
        const scoutKey = _this.getCalendarKey(scout);
        const scoutAttend = _this.calendar.attendance[scoutKey];
        if (scoutAttend && scoutAttend.meeting) {
            const attendmeeting = scoutAttend.meeting.length;
            meetingPercent = attendmeeting/totalMeeting ;
        }
        return Math.round(meetingPercent * 100);
    }
    _this.getOtherPercent = function(scout) {
        let otherPercent = 0;
        const totalOther = _this.calendar.other.length;
        const scoutKey = _this.getCalendarKey(scout);
        const scoutAttend = _this.calendar.attendance[scoutKey];
        if (scoutAttend && scoutAttend.other) {
            const attendOther = scoutAttend.other.length;
            otherPercent = attendOther / totalOther;
        }
        return Math.round( otherPercent * 100);
    }

    _this.getTotalPercent = function(scout) {
        let totalPercent = 0;
        if (scout) {
            const totalCamping = _this.calendar.camping.length;
            const totalMeeting = _this.calendar.meeting.length;
            const totalOther = _this.calendar.other.length;
            const scoutKey = _this.getCalendarKey(scout);
            const scoutAttend = _this.calendar.attendance[scoutKey];
            if (scoutAttend) {
                const attendCamping = scoutAttend.camping ? scoutAttend.camping.length : 0;
                const attendMeeting = scoutAttend.meeting ? scoutAttend.meeting.length : 0;
                const attendOther = scoutAttend.other ? scoutAttend.other.length : 0;
                totalPercent = ((attendCamping/totalCamping) +
                    (attendMeeting/totalMeeting) +
                    (attendOther/totalOther)) / 3;
            }
        }
        return Math.round(totalPercent * 100);
    }
}
