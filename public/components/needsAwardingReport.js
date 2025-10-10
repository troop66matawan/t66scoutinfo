app.component('needsAwardingReport', {
    controller: ['ScoutbookDBService', 'ScoutbookDBConstant', NeedsAwardingController],
    templateUrl: 'templates/needsAwardingReport.html',
    bindings: {
        scouts: '<'
    }
});

function NeedsAwardingController(ScoutbookDBService, ScoutbookDBConstant ) {
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
        _this.mbToBeAwarded = [];
        _this.activeScouts = ScoutbookDBService.getActiveScouts(_this.scouts);
        _this.activeScouts.forEach(function(scout){
            let scoutRanksToBeAwarded = [];
            ranks.forEach(function(rank) {
                let scoutRank = ScoutbookDBService.getRankObj(scout, rank);
                if (ScoutbookDBService.needsAwarding(scoutRank) === true) {
                    scoutRanksToBeAwarded.push(rank);
                }
            });
            if (scoutRanksToBeAwarded.length > 0) {
                _this.ranksToBeAwarded.push({scout: scout, ranks: scoutRanksToBeAwarded})
            }

            let meritBadges = ScoutbookDBService.getMeritBadges(scout);
            let scoutMbToBeAwarded = [];
            meritBadges.forEach(function(mb) {
               if (ScoutbookDBService.needsAwarding(mb) === true) {
                   scoutMbToBeAwarded.push(mb._type);
               }
            });
            if (scoutMbToBeAwarded.length > 0) {
                _this.mbToBeAwarded.push({scout: scout, mbs: scoutMbToBeAwarded});
            }
        })
        var styleElement = document.getElementById('awardReport');
        styleElement.append('@media print { @page { size: letter portrait; } }');

        _this.ranksToBeAwarded.sort(_this.sortByName);
        _this.mbToBeAwarded.sort(_this.sortByName);
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