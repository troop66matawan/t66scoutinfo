angular.module('t66tmweb')
    .service('ScoutbookLeadershipService', ['ScoutbookDBConstant', 'ScoutbookDBService', ScoutbookLeadershipService]);

function ScoutbookLeadershipService(ScoutbookDBConstant, ScoutbookDBService) {
    const _this = this;

    _this.LEADERSHIP_TENURE_MONTHS = {};
    _this.LEADERSHIP_TENURE_MONTHS[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] =  4;
    _this.LEADERSHIP_TENURE_MONTHS[ScoutbookDBConstant.ADVANCEMENT.STAR] = 6;
    _this.LEADERSHIP_TENURE_MONTHS[ScoutbookDBConstant.ADVANCEMENT.LIFE] = 6;

    _this.getCurrentLeadershipPositions = function(scout) {
        let currentPositions = [];
        if (scout) {
            if (scout._leadership && Array.isArray(scout._leadership._positions)) {
                scout._leadership._positions.forEach(function(pos) {
                    if (pos.hasOwnProperty('_endDate') && pos._endDate.length === 0) {
                        currentPositions.push(pos);
                    }
                });
            }
        }
        return currentPositions;
    };

    _this.getDurationDays = function(startDate, endDate) {
       let days;
        if (startDate.getTime() < endDate.getTime()) {
            const seconds = endDate.getTime() - startDate.getTime();
            days = seconds / (1000*60*60*24);
        }
        return days;
    }

    _this.getDurationOfTenure = function(position) {
        let tenure=0;
        if (position && position._startDate) {
             let startDate = new Date(position._startDate);
             let endDate = new Date();
             if (position._endDate && position._endDate.length > 0) {
                 endDate = new Date(position._endDate);
             }
             tenure = _this.getMonthsDiff(startDate, endDate);
        }
        return tenure;
    };

    _this.getMonthsDiff = function(startDate, endDate) {
        let tenure = 0;
        if (startDate.getTime() < endDate.getTime()) {
            const yearDiff = endDate.getFullYear() - startDate.getFullYear();
            const monthDiff = endDate.getMonth() - startDate.getMonth();
            tenure = yearDiff * 12 + monthDiff;
            const dayDiff = endDate.getDate() - startDate.getDate();
            if (dayDiff < 0) {
                tenure--;
            }
        }
        return tenure;
    }

    _this.getTenureRemaining = function(scout) {
        let tenureRemaining=0;
        const currentRank = ScoutbookDBService.getCurrentRank(scout);
        if (currentRank) {
            const neededTenure = _this.LEADERSHIP_TENURE_MONTHS[currentRank];
            if (neededTenure) {
                tenureRemaining = neededTenure;
                const rankDate = ScoutbookDBService.getRankDate(scout, currentRank);
                const rankTime = rankDate.getTime();
                if (scout._leadership && Array.isArray(scout._leadership._positions)) {
                    const positions = scout._leadership._positions;
                    const curRankPositions = [];
                    for (let posI = 0; posI < positions.length; posI++) {
                        const position = positions[posI];
                        if (position._position.startsWith('Assistant Patrol Leader')) {
                            continue;
                        }
                        const startDate = new Date(position._startDate);
                        let endDate = new Date();
                        if (position._endDate && position._endDate.length > 0) {
                            endDate = new Date(position._endDate);
                        }
                        if (startDate.getTime() >= rankTime) {
                            const duration = _this.getDurationOfTenure(position);
                            if (duration > neededTenure) {
                                return 0;
                            } else {
                                curRankPositions.push(position);
                            }
                        } else if (endDate.getTime() > rankTime) {
                            if (startDate.getTime() < rankTime) {
                                const positionDays = _this.getDurationDays(rankDate, endDate);
                                const posMonths = positionDays / 30;
                                if (posMonths > neededTenure) {
                                    return 0;
                                } else {
                                    curRankPositions.push(position);
                                }
                            }
                        }
                    }
                    let tenurePeriods = [];
                    const now = new Date().getTime();
                    curRankPositions.forEach(function(pos) {
                        let posStart = new Date(pos._startDate).getTime();
                        let posEnd = now;
                        if (posStart < rankTime) {
                            posStart = rankTime;
                        }
                        if (pos._endDate && pos._endDate.length > 0) {
                            posEnd = new Date(pos._endDate).getTime();
                        }
                        if (tenurePeriods.length === 0) {
                            tenurePeriods.push({start: posStart, end: posEnd});
                        } else {
                            let updatedOrSame = false;
                            for (let i=0; (i < tenurePeriods.length && updatedOrSame === false); i++) {
                                const tenurePos = tenurePeriods[i];
                                if (posStart === tenurePos.start && posEnd === tenurePos.end) {
                                    updatedOrSame = true;
                                    continue;
                                }
                                if (posStart < tenurePos.start && posEnd <= tenurePos.end){
                                    // move start
                                    tenurePos.start = posStart;
                                    updatedOrSame = true;
                                } else if (posStart > tenurePos.start && posEnd < tenurePos.end) {
                                    // move end
                                    tenurePos.end = posEnd;
                                    updatedOrSame = true;
                                }
                            }
                            if (!updatedOrSame) {
                                tenurePeriods.push({start: posStart, end: posEnd});
                            }
                        }
                    });
                    let tenure=0;
                    tenurePeriods.forEach(function(pos) {
                        const duration = pos.end - pos.start;
                        tenure += duration;
                    });
                    const endTenure = new Date(rankTime+tenure);
                    const leadershipTenure = _this.getMonthsDiff(rankDate, endTenure);
                    if (leadershipTenure >= neededTenure) {
                        return 0;
                    } else {
                        let calendarTenureDate = new Date(rankDate.getTime());
                        let month = rankDate.getMonth();
                        if ((month + neededTenure) > 11) {
                            calendarTenureDate.setMonth(month+neededTenure-12);
                            calendarTenureDate.setFullYear(calendarTenureDate.getFullYear()+1);
                        } else {
                            calendarTenureDate.setMonth(month+neededTenure);
                        }
                        const tenureDiffSeconds = calendarTenureDate.getTime() - endTenure.getTime();
                        tenureRemaining = tenureDiffSeconds / (1000 * 60 * 60 * 24);
                    }
                }
            }
        }
        return Math.ceil(tenureRemaining);
    }
}