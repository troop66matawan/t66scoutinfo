app.component('scoutinfo', {
    templateUrl: 'templates/scoutinfo.html',
    bindings: {
        scout: '=',
        contact: '='
    },
    controller: ScoutInfoController
});

function ScoutInfoController(ScoutbookDBService, $scope, ScoutbookLeadershipService, ScoutbookActivityService) {
    const _this = this;
    $scope.ScoutbookDBService = ScoutbookDBService;
    $scope.ScoutbookLeadershipService = ScoutbookLeadershipService;

    _this.getContact = function(){
        let contact;
        if (_this.scout) {
            contact = _this.scout._contactInfo;
            if (contact === undefined) {
                contact = _this.scout;
            }
        }
        return contact;
    }

    _this.getTotalService = function() {
        let totalService = '';
        const neededService = ScoutbookActivityService.getScoutServiceNeeededForNextRank(_this.scout);
        if (neededService && neededService.total > -1) {
            totalService = neededService.total;
        }
        return totalService;
    }
    _this.getConservationService = function() {
        let conservation = '';
        const neededService = ScoutbookActivityService.getScoutServiceNeeededForNextRank(_this.scout);
        if (neededService && neededService.conservation > -1) {
            conservation = neededService.conservation;
        }
        return conservation;
    }
    _this.getTotalAttendance = function() {
        return ScoutbookDBService.getTotalPercent(_this.scout);
    }
}
