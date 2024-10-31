angular.module('t66tmweb')
    .service('ScoutbookActivityService', ['ScoutbookDBConstant', 'ScoutbookDBService', ScoutbookActivityService]);

function ScoutbookActivityService(ScoutbookDBConstant, ScoutbookDBService) {
    const _this = this;

    _this.SERVICE_NEEDED_NEXT_RANK = {};
    _this.SERVICE_NEEDED_NEXT_RANK[ScoutbookDBConstant.ADVANCEMENT.SCOUT] = {total: 1, conservation: 0};
    _this.SERVICE_NEEDED_NEXT_RANK[ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT] = {total: 3, conservation: 0};
    _this.SERVICE_NEEDED_NEXT_RANK[ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS] = {total: 6, conservation: 0};
    _this.SERVICE_NEEDED_NEXT_RANK[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] = {total: 6, conservation: 0};
    _this.SERVICE_NEEDED_NEXT_RANK[ScoutbookDBConstant.ADVANCEMENT.STAR] = {total: 6, conservation: 3};

    _this.SERVICE_REQUIREMENT={}
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.LIFE] = {};
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.LIFE]['2016'] = "4";
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.STAR] = {};
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.STAR]['2016'] = "4";
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS] = {};
    _this.SERVICE_REQUIREMENT[ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS]['2016'] = "9d";

    _this.getScoutServiceActivities = function(scout) {
        let service;
        if (scout && scout._activities && scout._activities._service) {
            service = scout._activities._service;
        }
        return service;
    }

    _this.getScoutServiceNeeededForNextRank = function(scout) {
        const neededService={total: -1, conservation: -1};
        if (scout) {
            const currentRank = ScoutbookDBService.getCurrentRank(scout);
            const nextRank = ScoutbookDBService.getNextRank(scout);
            const rankObj = ScoutbookDBService.getRankObj(scout,nextRank);
            if (rankObj && rankObj._version) {
                const req =  _this.SERVICE_REQUIREMENT[nextRank];
                if (req && req[rankObj._version] !== undefined) {
                    const requirement = ScoutbookDBService.getRequirement(rankObj, req[rankObj._version]);
                    if (requirement && requirement._isApproved === true) {
                        neededService.total =0;
                        neededService.conservation=0;
                    }
                }
            }
            const service = _this.getScoutServiceActivities(scout);
            if (currentRank && neededService.conservation !== 0 && neededService.total !== 0) {
                let requiredService = neededService;
                switch (currentRank) {
                    case ScoutbookDBConstant.ADVANCEMENT.SCOUT:
                    case ScoutbookDBConstant.ADVANCEMENT.TENDERFOOT:
                    case ScoutbookDBConstant.ADVANCEMENT.SECOND_CLASS:
                    case ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS:
                    case ScoutbookDBConstant.ADVANCEMENT.STAR:
                        requiredService = _this.SERVICE_NEEDED_NEXT_RANK[currentRank];
                        break;
                    default:
                        break;
                }
                let serviceList = service || [];
                switch (currentRank) {
                    case ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS:
                    case ScoutbookDBConstant.ADVANCEMENT.STAR:
                        serviceList = _this.getScoutServiceCurrentRank(scout);
                        break;
                    default:
                        break;
                }
                if (requiredService.total > 0 || requiredService.conservation >0) {
                    neededService.total = requiredService.total;
                    neededService.conservation = requiredService.conservation;

                    for (let i=0; i < serviceList.length && (neededService.total > 0 || neededService.conservation > 0); i++) {
                        const serviceProj = serviceList[i];
                        if (serviceProj._conservation === true) {
                            if (serviceProj._count > neededService.conservation) {
                                neededService.conservation = 0;
                            } else {
                                neededService.conservation -= serviceProj._count;
                            }
                        }
                        if (serviceProj._count > neededService.total) {
                            neededService.total = 0;
                        } else {
                            neededService.total -= serviceProj._count;
                        }
                    }
                    // if Next rank is first class, must have >= 2 service projects
                    if (nextRank === ScoutbookDBConstant.ADVANCEMENT.FIRST_CLASS && serviceList.length < 2) {
                        neededService.total = 3;
                    }
                }
            }
        }
        return neededService;
    }
    _this.getScoutServiceCurrentRank = function(scout) {
        let currentService=[];
        const currentRankDate = ScoutbookDBService.getRankDate(scout, ScoutbookDBService.getCurrentRank(scout));
        if (currentRankDate) {
            const allService = _this.getScoutServiceActivities(scout);
            if (allService && Array.isArray(allService) && allService.length > 0) {
                for (let i=0; i < allService.length; i++) {
                    const service = allService[i];
                    const svcDate = new Date(service._date);
                    if (svcDate.getTime() > currentRankDate.getTime()) {
                        currentService.push(service);
                    }
                }
            }
        }
        return currentService;
    }

    _this.getTotalServiceHours = function(serviceList) {
        let hours=0;
        if (serviceList && Array.isArray(serviceList) && serviceList.length > 0) {
            for (let i=0; i < serviceList.length; i++) {
                const service = serviceList[i];
                if (service  && service._count !== undefined) {
                    hours += service._count;
                }
            }
        }
        return hours;
    }
    _this.getConservationHours = function(serviceList) {
        let hours=0;
        if (serviceList && Array.isArray(serviceList) && serviceList.length > 0) {
            for (let i=0; i < serviceList.length; i++) {
                const service = serviceList[i];
                if (service && service._conservation === true && service._count !== undefined) {
                    hours += service._count;
                }
            }
        }
        return hours;
    }
}