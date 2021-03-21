angular.module('t66tmweb')
    .service('ScoutbookReqtAnalysisService', ['ScoutbookDBConstant', 'ScoutbookDBService',ScoutbookReqtAnalysisService]);

function ScoutbookReqtAnalysisService(ScoutbookDBConstant, ScoutbookDBService) {
    const _this = this;

    _this.tenderfoot2016_1b = function(scout) {
        // camp 1 night in tent you helped pitch
        if (scout) {
            const tenderfoot = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT);
            const req1b = ScoutbookDBService.getRequirement(tenderfoot, '1b');
            if (req1b && req1b._isApproved !== true) {
                let campingCount=0;
                const camping = ScoutbookDBService.getCamping(scout);
                if (camping && Array.isArray(camping) && camping.length > 0) {
                    camping.forEach(function (activity) {
                        if (activity && activity._count > 0 && activity._notes.indexOf('cabin') === -1) {
                            // Only count activities where overnight not in cabin
                            campingCount++;
                        }
                    });
                }
                if (campingCount >= 1 ) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT, requirement: '1b'})
                }
            }
        }
    };
    _this.tenderfoot2016_7b = function(scout) {
        // perform 1 hour of service
        if (scout) {
            const tenderfoot = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT);
            const req7b = ScoutbookDBService.getRequirement(tenderfoot, '7b');
            if (req7b && req7b._isApproved !== true) {
                let serviceHours=0;
                const service = ScoutbookDBService.getService(scout);
                if (service && Array.isArray(service) && service.length > 0) {
                    service.forEach(function (activity) {
                        if (activity && activity._count > 0) {
                            serviceHours += activity._count;
                        }
                    });
                }
                if (serviceHours >= 1) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT, requirement: '7b'})
                }
            }
        }
    };

    _this.secClass2016_1a = function(scout) {
        // 5 activities, 3 outdoor, 2 overnight camping (not cabin)
        if (scout) {
            const secClass = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS);
            const req1a = ScoutbookDBService.getRequirement(secClass, '1a');
            if (req1a && req1a._isApproved !== true) {
                let campingCount=0;
                let outdoorService=0;
                const camping = ScoutbookDBService.getCamping(scout);
                if (camping && Array.isArray(camping) && camping.length > 0) {
                    camping.forEach(function (activity) {
                        if (activity && activity._count > 0 && activity._notes.indexOf('cabin') === -1) {
                            // Only count activities where overnight not in cabin
                            campingCount++
                        }
                    });
                }
                const service = ScoutbookDBService.getService(scout);
                if (service && Array.isArray(service) && service.length > 0) {
                    service.forEach(function (activity) {
                        if (activity && activity._count > 0 &&
                            (activity._conservation === true || activity._notes.indexOf('^outdoor^') !== -1)) {
                            outdoorService++;
                        }
                    });
                }
                // TODO: Get outdoor events from calendar that are not camping or service
                if (campingCount >= 2 && (campingCount + outdoorService) >= 5 ) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS, requirement: '1a'})
                }
            }
        }
    };
    _this.secClass2016_8e = function(scout) {
        // 2 hours service + 1 hour for tenderfoot
        if (scout) {
            const secClass = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS);
            const req8e = ScoutbookDBService.getRequirement(secClass, '8e');
            if (req8e && req8e._isApproved !== true) {
                let serviceHours=0;
                const service = ScoutbookDBService.getService(scout);
                if (service && Array.isArray(service) && service.length > 0) {
                    service.forEach(function (activity) {
                        if (activity && activity._count > 0) {
                            serviceHours += activity._count;
                        }
                    });
                }
                // TODO: Get outdoor events from calendar that are not camping or service
                if (serviceHours >= 3) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS, requirement: '8e'})
                }
            }
        }
    }

    _this.initialize = function() {
        _this.requirementAnalyzer = {};
        _this.results = [];
        _this.requirementAnalyzer[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT] = [{
            version: 2016,
            requirements: {
                '1b': _this.tenderfoot2016_1b,
                '7b': _this.tenderfoot2016_7b,
            }
        }];
        _this.requirementAnalyzer[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS] = [{
            version: 2016,
            requirements: {
                '1a': _this.secClass2016_1a,
                '81': _this.secClass2016_8e,
            }
        }]
    };

    _this.analyze = function(scout) {
        if (scout) {
            const ranks = Object.keys(ScoutbookDBConstant.ADVANCEMENT);
            ranks.forEach(function(rankName){
                const rank = ScoutbookDBConstant.ADVANCEMENT[rankName]
                const rankObj = ScoutbookDBService.getRankObj(scout, rank);
                const analyzer = _this.requirementAnalyzer[rank];
                if (rankObj && rankObj._isApproved === false && analyzer) {
                    const version = rankObj._requirements._version;
                    if (analyzer && Array.isArray(analyzer)) {
                        analyzer.forEach(function(verGroup) {
                            if (verGroup.version === version) {
                                _this.analyzeRequirements(verGroup.requirements, scout);
                            }
                        })
                    }
                }
            });
        }
    };
    _this.analyzeRequirements = function(requirements, scout) {
        const reqIds = Object.keys(requirements);
        reqIds.forEach(function(id){
            requirements[id](scout);
        });
    }
}