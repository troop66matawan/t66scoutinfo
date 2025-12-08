app.component('rankEarnedReport', {
    controller: ['ScoutbookDBService', 'ScoutbookDBConstant', RankEarnedController],
    templateUrl: 'templates/rankEarned.html',
    bindings: {
        scouts: '<'
    }
});

function RankEarnedController(ScoutbookDBService, ScoutbookDBConstant ) {
    var _this = this;

    var ranks = [ ScoutbookDBConstant.ADVANCEMENT.SCOUT,
        ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT,
        ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS,
        ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS,
        ScoutbookDBConstant.ADVANCEMENT.STAR,
        ScoutbookDBConstant.ADVANCEMENT.LIFE
    ]

    _this.$onInit = function() {
        _this.ranksToBeAwarded = [];
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth()-1, 1);
        let  endDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate.setDate(endDate.getDate() -1);
        _this.rankEarnedStartDate = startDate.toLocaleDateString();
        _this.rankEarnedEndDate = endDate.toLocaleDateString()
        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts);
        _this.activeScouts.forEach(function(scout){
            let scoutRanksEarned = [];
            ranks.forEach(function(rank) {
                let scoutRank = ScoutbookDBService.getRankObj(scout, rank);
                if (ScoutbookDBService.isEarnedWithin(scoutRank,
                    new Date(_this.rankEarnedStartDate),
                    new Date(_this.rankEarnedEndDate)) === true) {
                    scoutRanksEarned.push({rank: rank, date: scoutRank._completionDate});
                }
            });
            if (scoutRanksEarned.length > 0) {
                _this.ranksToBeAwarded.push({scout: scout, ranks: scoutRanksEarned})
            }

        })
        var styleElement = document.getElementById('rankEarnedReport');
        styleElement.append('@media print { @page { size: letter portrait; } }');

        _this.ranksToBeAwarded.sort(_this.sortByName);
    }

    _this.filterDate = function() {
        _this.ranksToBeAwarded = [];

        console.log(_this.startDate);
        console.log(_this.endDate);
        _this.rankEarnedStartDate = _this.startDate.toLocaleDateString();
        _this.rankEarnedEndDate = _this.endDate.toLocaleDateString();

        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts);
        _this.activeScouts.forEach(function(scout){
            let scoutRanksEarned = [];
            ranks.forEach(function(rank) {
                let scoutRank = ScoutbookDBService.getRankObj(scout, rank);
                if (ScoutbookDBService.isEarnedWithin(scoutRank,
                    new Date(_this.rankEarnedStartDate),
                    new Date(_this.rankEarnedEndDate)) === true) {
                    scoutRanksEarned.push({rank: rank, date: scoutRank._completionDate});
                }
            });
            if (scoutRanksEarned.length > 0) {
                _this.ranksToBeAwarded.push({scout: scout, ranks: scoutRanksEarned})
            }

        })
        _this.ranksToBeAwarded.sort(_this.sortByName);

    }
    _this.displayRank = function(rank) {
        let displayName = rank;
        switch (rank) {
            case ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT:
                displayName = "Tenderfoot";
                break;
            case ScoutbookDBConstant.ADVANCEMENT.SCOUT:
                displayName = "Scout";
                break;
        }
        return displayName;
    }
    _this.displayDate = function(dateString) {
        let displayDate= ""
        if (dateString) {
            let date = new Date(dateString)
            displayDate = "(" + date.toLocaleDateString() + ")";
        }
        return displayDate;
    }
    _this.sortByName = function(l1, l2) {
        let s1 = l1.scout;
        let s2 = l2.scout;
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
}