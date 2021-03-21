angular.module('t66tmweb')
    .service('ScoutbookReqtAnalysisService', ['ScoutbookDBConstant', 'ScoutbookDBService','ScoutbookLeadershipService',
        ScoutbookReqtAnalysisService]);

function ScoutbookReqtAnalysisService(ScoutbookDBConstant, ScoutbookDBService, ScoutbookLeadershipService) {
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
                let otherActivity=0;
                const camping = ScoutbookDBService.getCamping(scout);
                if (camping && Array.isArray(camping) && camping.length > 0) {
                    camping.forEach(function (activity) {
                        if (activity && activity._count > 0 && activity._notes.indexOf('cabin') === -1) {
                            // Only count activities where overnight not in cabin
                            campingCount++
                        } else {
                            otherActivity++;
                        }
                    });
                }
                const service = ScoutbookDBService.getService(scout);
                if (service && Array.isArray(service) && service.length > 0) {
                    service.forEach(function (activity) {
                        if (activity && activity._count > 0 &&
                            (activity._conservation === true || activity._notes.indexOf('^outdoor^') !== -1)) {
                            outdoorService++;
                        } else {
                            otherActivity++;
                        }
                    });
                }
                // TODO: Get outdoor events from calendar that are not camping or service
                if (campingCount >= 2 && (campingCount + outdoorService) >= 3 &&
                    (campingCount + outdoorService + otherActivity >= 5)) {
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
                if (serviceHours >= 3) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS, requirement: '8e'})
                }
            }
        }
    }

    _this.firstClass2016_1a = function(scout) {
        // 10 activities, 6 outdoor, 3 overnight camping (not cabin)
        if (scout) {
            const firstClass = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS);
            const req1a = ScoutbookDBService.getRequirement(firstClass, '1a');
            if (req1a && req1a._isApproved !== true) {
                let campingCount=0;
                let outdoorService=0;
                let otherActivity=0;
                const camping = ScoutbookDBService.getCamping(scout);
                if (camping && Array.isArray(camping) && camping.length > 0) {
                    camping.forEach(function (activity) {
                        if (activity && activity._count > 0 && activity._notes.indexOf('cabin') === -1) {
                            // Only count activities where overnight not in cabin
                            campingCount++;
                        } else {
                            otherActivity++;
                        }
                    });
                }
                const service = ScoutbookDBService.getService(scout);
                if (service && Array.isArray(service) && service.length > 0) {
                    service.forEach(function (activity) {
                        if (activity && activity._count > 0 &&
                            (activity._conservation === true || activity._notes.indexOf('^outdoor^') !== -1)) {
                            outdoorService++;
                        } else {
                            otherActivity++;
                        }
                    });
                }
                // TODO: Get outdoor events from calendar that are not camping or service
                if (campingCount >= 3 && (campingCount + outdoorService) >= 6  &&
                    (campingCount + outdoorService + otherActivity) >= 10) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS, requirement: '1a'})
                }
            }
        }
    };
    _this.firstClass2016_9d = function(scout) {
        // 3 hours + 2 hours service 2nd class + 1 hour for tenderfoot
        if (scout) {
            const firstClass = ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS);
            const req8e = ScoutbookDBService.getRequirement(firstClass, '9d');
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
                if (serviceHours >= 6) {
                    _this.results.push({scout: scout, rank: ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS, requirement: '9d'})
                }
            }
        }
    }

    _this.star2016_1 = function(scout) {
        // Four months since earning first class
        const reqID = '1';
        const rank = ScoutbookDBConstant.ADVANCEMENT.STAR;
        if (scout) {
            const rankObj = ScoutbookDBService.getRankObj(scout, rank );
            const req = ScoutbookDBService.getRequirement(rankObj, reqID);
            if (req && req._isApproved !== true) {
                const firstClass =  ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS );
                if (firstClass && firstClass._isApproved === true) {
                    const firstClassDate = ScoutbookDBService.getRankDate(scout, firstClass);
                    const now = new Date();
                    const months = ScoutbookLeadershipService.getMonthsDiff(firstClassDate, now);
                    if (months >= 4) {
                        _this.results.push({scout: scout, rank: rank, requirement: reqID});
                    }
                }
            }
        }
    };
    _this.star2016_3 = function(scout) {
        // 6 merit badges, 4 eagle required
    };
    _this.star2016_4 = function(scout) {
        // 6 hours service after first class
        const reqID = '4';
        const rank = ScoutbookDBConstant.ADVANCEMENT.STAR;
        if (scout) {
            const rankObj = ScoutbookDBService.getRankObj(scout, rank );
            const req = ScoutbookDBService.getRequirement(rankObj, reqID);
            if (req && req._isApproved !== true) {
                const firstClass =  ScoutbookDBService.getRankObj(scout, ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS );
                if (firstClass && firstClass._isApproved === true) {
                    const firstClassDate = ScoutbookDBService.getRankDate(scout, ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS);
                    let serviceHours=0;
                    const service = ScoutbookDBService.getService(scout);
                    if (service && Array.isArray(service) && service.length > 0) {
                        service.forEach(function (activity) {
                            const activityDate = new Date(activity._date);
                            if (activity && activity._count > 0 && activityDate.getTime() > firstClassDate.getTime()) {
                                serviceHours += activity._count;
                            }
                        });
                    }

                    if (serviceHours >= 6) {
                        _this.results.push({scout: scout, rank: rank, requirement: reqID});
                    }
                }
            }
        }
    };
    _this.star2016_5 = function(scout) {
        // 4 months leadership while first class
    };
    
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
        }];
        _this.requirementAnalyzer[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] = [{
            version: 2016,
            requirements: {
                '1a': _this.firstClass2016_1a,
                '9d': _this.firstClass2016_9d,
            }
        }];
        _this.requirementAnalyzer[ScoutbookDBConstant.ADVANCEMENT.STAR] = [{
            version: 2016,
            requirements: {
                '1': _this.star2016_1,
                '3': _this.star2016_3,
                '4': _this.star2016_4,
                '5': _this.star2016_5,
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