angular.module('t66tmweb')
    .service('ScoutbookRankReportService', ['ScoutbookDBConstant', 'ScoutbookDBService', ScoutbookRankReportService]);

function ScoutbookRankReportService(ScoutbookDBConstant, ScoutbookDBService) {
    const _this = this;

    _this.initialize = function() {
        this.results = {};
        this.results[ScoutbookDBConstant.ADVANCEMENT.NONE] = {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.SCOUT] = {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT]= {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS]= {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS]= {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.STAR]= {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.LIFE]= {
            count: 0,
            scouts: []
        };
        this.results[ScoutbookDBConstant.ADVANCEMENT.EAGLE]= {
            count: 0,
            scouts: []
        };
    };

    _this.analyze = function(scout) {
        if (scout !== undefined) {
            let currentRank = ScoutbookDBService.getCurrentRank(scout);
            if (currentRank === undefined) {
                currentRank = ScoutbookDBConstant.ADVANCEMENT.NONE;
            }
            this.results[currentRank].count++;
            this.results[currentRank].scouts.push(scout);
        }
    }
}