angular.module('t66tmweb')
    .service('ScoutbookDBService', ['ScoutbookDBConstant',ScoutbookDBService])
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

function ScoutbookDBService(ScoutbookDBConstant) {
    const _this = this;
    _this.initDB = function() {
        _this.dbRef = firedb.ref('scoutbookDb');
        _this.dbRef.on('value', function(curSnapshot) {
            _this.scouts = _this.firePropsToArray(curSnapshot.val());
            console.log(_this.scouts);
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

    _this.getDate = function(scoutbookDate) {
        let date;
        if (scoutbookDate) {
            const splits = scoutbookDate.split('/');
            if (splits.length === 3) {
                date = new Date(splits[2], splits[0] - 1, splits[1]);
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
        if (scout && scout._advancement && scout._advancement.hasOwnProperty(rank) && scout._advancement[rank]._isApproved) {
            currank = scout._advancement[rank];
        }
        return currank;
    };

    _this.getRankDate = function(scout, rank) {
        let rankDate;
        const curRank = _this.getRankObj(scout,rank);
        if (curRank) {
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
}
