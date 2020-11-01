app.component('scoutinfo', {
    templateUrl: 'templates/scoutinfo.html',
    bindings: {
        scout: '=',
        contact: '='
    },
    controller: ScoutInfoController
});

function ScoutInfoController(ScoutbookDBService, $scope, ScoutbookLeadershipService) {
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
}
