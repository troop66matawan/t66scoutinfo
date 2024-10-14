app.component('rankCompletionReport', {
    bindings: {
        scouts: '<'
    },
    templateUrl: 'templates/rankCompletionReport.html',
    controller: ['ScoutbookDBService', 'ScoutbookDBConstant','RankPatchFactory','CsvDownloadService', RankCompletionController]
});

function RankCompletionController(ScoutbookDBService, ScoutbookDBConstant, RankPatchFactory, CsvDownloadService ) {
    var _this = this;

    _this.$onInit = function() {
        _this.rankPatch = {};
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.SCOUT] = "_scout";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT] = "_tenderfoot";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS] = "_2ndClass";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] = "_1stClass";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.STAR] = "_star";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.LIFE] = "_life";
        _this.rankPatch [ScoutbookDBConstant.ADVANCEMENT.EAGLE] = "_eagle";

        _this.enabledRank={};
        _this.ranks = [
            ScoutbookDBConstant.ADVANCEMENT.SCOUT,
            ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT,
            ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS,
            ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS /*,
            ScoutbookDBConstant.ADVANCEMENT.STAR,
            ScoutbookDBConstant.ADVANCEMENT.LIFE,
            ScoutbookDBConstant.ADVANCEMENT.EAGLE */
        ]
        _this.addRanks = {};
        _this.addRanks[ScoutbookDBConstant.ADVANCEMENT.SCOUT] = [
            ScoutbookDBConstant.ADVANCEMENT.SCOUT,
            ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT,
            ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS,
            ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS
        ];
        _this.addRanks[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT] = [
            ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT,
            ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS,
            ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS
        ];
        _this.addRanks[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS] = [
            ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS,
            ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS
        ];
        _this.addRanks[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] = [
            ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS
        ];
        _this.addRanks[ ScoutbookDBConstant.ADVANCEMENT.STAR] = [];
        _this.addRanks[ ScoutbookDBConstant.ADVANCEMENT.LIFE] = [];
        _this.addRanks[ ScoutbookDBConstant.ADVANCEMENT.EAGLE] = [];

        _this.rank = {};
        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts);
        _this.activeScouts.forEach(function(scout){
            let nextRank = ScoutbookDBService.getNextRank(scout);
            _this.enabledRank[nextRank] = true;
            for (const addRank of _this.addRanks[nextRank]) {
                if (_this.rank[addRank] === undefined) {
                    _this.rank[addRank] = [];
                }
                _this.rank[addRank].push(scout);
            }
        })
        for (const rank in _this.rank) {
            _this.rank[rank].sort(_this.sortByName);
        }
        var styleElement = document.getElementById('rosterReport');
        styleElement.append('@media print { @page { size: letter portrait; } }');
    };

    _this.getCurRank = function(scout) {
        return ScoutbookDBService.getCurrentRankText(scout);
    }
    _this.sortByName = function(s1, s2) {
        if (s1._lastName < s2._lastName) {
            return -1;
        }
        if (s1._lastName === s2._lastName ) {
            if (s1._firstName < s2._firstName ) {
                return -1;
            } else {
                return 1;
            }
        }
        return 1;
    }

    _this.getRankObj = function(rankString, scout) {
        return scout._advancement[rankString];
    }
    _this.sortRequirementsArray = function(e1,e2) {
        const id1 = e1._id;
        const index1 = parseInt(id1,10);
        const id2 = e2._id;
        const index2 = parseInt(id2,10);

        let rval;
        if (index1 < index2) {
            rval = -1;
        } else if (index1 > index2) {
            rval = 1;
        } else {
            // indexes are equal.  Check for alpha.
            const num1 = ''+index1;
            const alpha1 = id1.substr(id1.indexOf(num1)+num1.length);
            const num2 = ''+index2;
            const alpha2 = id2.substr(id2.indexOf(num2)+num2.length);

            if (alpha1 < alpha2) {
                rval = -1;
            } else if (alpha1 > alpha2) {
                rval = 1;
            } else {
                rval =0;
            }
        }
        return rval;
    }
    _this.getRankRequirements = function(rankObj) {
        let requirements = [];
        const req = rankObj._requirements._requirement;
        for (const key in req) {
            requirements.push(req[key]);
        }
        return requirements.sort(_this.sortRequirementsArray);
    }

    _this.getRankPatch = function(rank) {
        // Force date after 2016 to use new scout patch.
        return RankPatchFactory.getPatchUrl(_this.rankPatch[rank], new Date("2017-1-1"));
    }

    _this.sumNumberOfScouts = function(scouts, rank, reqId) {
        let sum = 0;
        for (let scout of scouts) {
            const rankObj = _this.getRankObj(rank, scout);
            if (rankObj._requirements._requirement[reqId]._markedCompleted === undefined) {
                sum++;
            }
        }
        return sum;
    }

    _this.export = function(scouts, rankString) {
        const requirements = _this.getRankRequirements(_this.getRankObj(rankString, _this.rank[rankString][0]));
        var csvString = CsvDownloadService.encodeCSV();
        csvString += 'Name, Rank';
        let reqTextString = ','
        for (const req of requirements) {
            csvString += "," + req._id;
            reqTextString += ',"' + req._requirementText + '"';
        }
        csvString += '\r\n';
        csvString += reqTextString + '\r\n';
        for (const scout of scouts) {
            csvString += scout._firstName + ' ' + scout._lastName + ',';
            csvString += _this.getCurRank(scout);
            const scoutRequirements = _this.getRankRequirements(_this.getRankObj(rankString, scout));
            for (const req of scoutRequirements) {
                if (req._markedCompleted !== undefined) {
                    csvString += ',Y';
                } else {
                    csvString += ',N'
                }
            }
            csvString += '\r\n';
        }
        CsvDownloadService.downloadCsv(csvString,'reqCompleted_'+rankString, _this.getDownloadId(rankString));
    }
    _this.getDownloadId = function(rank) {
        return 'reqDownload_'+rank;
    }
}
